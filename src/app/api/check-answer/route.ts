import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // seconds — keep the call snappy

// ─── POST /api/check-answer ────────────────────────────────────────────
// Lightweight AI grader: receives a question, the model answer, and the
// student's answer. Returns { isCorrect, feedback }.
//
// Design goals:
//   - FAST — single turn, thinking disabled, short response
//   - LENIENT — student answers are not expected to be model answers
//   - FOCUSED — only judges whether the meaning/concept is correct
interface CheckAnswerRequest {
  question: string
  modelAnswer: string
  userAnswer: string
  type?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckAnswerRequest
    const { question, modelAnswer, userAnswer, type } = body

    // ─── Basic validation ───
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }
    if (!modelAnswer || typeof modelAnswer !== 'string') {
      return NextResponse.json({ error: 'Model answer is required' }, { status: 400 })
    }
    if (!userAnswer || typeof userAnswer !== 'string' || userAnswer.trim().length === 0) {
      return NextResponse.json({ error: 'User answer is required' }, { status: 400 })
    }

    // ─── Short-circuit: trivial exact match ───
    // Skip the AI call entirely if the student typed something obviously correct.
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[.\s]+$/g, '')
    if (normalize(userAnswer) === normalize(modelAnswer)) {
      return NextResponse.json({
        isCorrect: true,
        feedback: 'Correct! Exact match with the model answer.',
      })
    }

    // ─── Call the LLM ───
    const zai = await ZAI.create()

    const systemPrompt = `You are a FAST, LENIENT exam grader for a university-level Microsoft Office / Database course.

Your job: decide whether the student's answer is CONCEPTUALLY CORRECT — i.e. it captures the same core meaning as the model answer.

Rules:
- Student answers do NOT need to be model answers. Accept paraphrases, partial answers, or answers in different word order.
- Accept answers in English OR Arabic OR a mix of both.
- Minor spelling/grammar mistakes are OK as long as the meaning is clear.
- Mark CORRECT if the student shows they understand the key concept.
- Mark WRONG only if the student is clearly mistaken, off-topic, or missing the key point entirely.
- Respond with STRICT JSON only, no markdown fences, no extra text.

Response format:
{
  "isCorrect": true | false,
  "feedback": "one short sentence (max 12 words). If correct, praise briefly. If wrong, hint at what's missing."
}`

    const userPrompt = `Question: ${question}

Model answer: ${modelAnswer}

Student's answer: ${userAnswer}

Judge the student's answer. Respond with JSON only.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const raw = completion.choices[0]?.message?.content ?? ''

    // ─── Parse the JSON response (tolerant of stray text) ───
    let isCorrect = false
    let feedback = ''

    // Try direct parse first
    try {
      const parsed = JSON.parse(raw)
      isCorrect = Boolean(parsed.isCorrect)
      feedback = typeof parsed.feedback === 'string' ? parsed.feedback : ''
    } catch {
      // Fallback: extract the first {...} block
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          isCorrect = Boolean(parsed.isCorrect)
          feedback = typeof parsed.feedback === 'string' ? parsed.feedback : ''
        } catch {
          // Last resort: look for true/false keywords
          const lower = raw.toLowerCase()
          isCorrect = /"iscorrect"\s*:\s*true/.test(lower) || /\bcorrect\b/.test(lower)
          feedback = raw.slice(0, 160)
        }
      } else {
        const lower = raw.toLowerCase()
        isCorrect = /\bcorrect\b/.test(lower) && !/\bwrong\b/.test(lower) && !/\bincorrect\b/.test(lower)
        feedback = raw.slice(0, 160)
      }
    }

    if (!feedback) {
      feedback = isCorrect ? 'Correct!' : 'Not quite — check the model answer.'
    }

    return NextResponse.json({
      isCorrect,
      feedback,
      type: type || 'definition',
    })
  } catch (error) {
    console.error('check-answer error:', error)
    // Fail soft — return a neutral "needs review" state instead of erroring the UI
    return NextResponse.json(
      {
        isCorrect: false,
        feedback: 'Could not reach the AI grader. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
