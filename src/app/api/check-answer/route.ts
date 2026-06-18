import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // seconds — keep the call snappy

// ─── POST /api/check-answer ────────────────────────────────────────────
// Semantic AI grader: understands the *meaning* of the model answer,
// extracts the key concepts that MUST appear, then checks the student's
// answer for conceptual coverage — not string similarity.
//
// Design goals:
//   - SMART — judges meaning, not wording
//   - STRICT — incomplete or partially-correct answers are marked wrong
//   - TRANSPARENT — feedback explicitly names what's missing / wrong
//   - MULTILINGUAL — auto-detects question language, replies in same language
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
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[.\s]+$/g, '')
    if (normalize(userAnswer) === normalize(modelAnswer)) {
      return NextResponse.json({
        isCorrect: true,
        feedback: '✓ Correct! Exact match with the model answer.',
        score: 100,
      })
    }

    // ─── Call the LLM ───
    const zai = await ZAI.create()

    const systemPrompt = `You are a STRICT, CONCEPT-AWARE exam grader for university-level courses (Microsoft Office, Database, Programming, IoT, Cyber Security, Technical English).

Your job: judge whether the student's answer *demonstrates real understanding* of the model answer — not whether the wording matches.

GRADING PROCEDURE (do this internally before responding):
1. Read the question and identify what concept is being tested.
2. From the MODEL ANSWER, extract the 2-5 KEY CONCEPTS that any correct answer MUST contain. (e.g. for "What is a primary key?" the key concepts are: uniquely identifies / row / not null / unique.)
3. Read the student's answer and check, for each key concept, whether it is present AND correct.
4. Detect factual errors, contradictions, or off-topic content → these are failures, not partial credit.
5. Assign a score 0-100:
   - 90-100: all key concepts present and correct (accept paraphrasing, different order, English/Arabic mix)
   - 60-89:  most key concepts present, minor gaps → STILL WRONG (mark isCorrect=false) but explain
   - 30-59:  partial understanding, major gaps → WRONG
   - 0-29:   mostly missing or wrong → WRONG
6. isCorrect = TRUE only when score >= 90 AND no factual errors.

STRICTNESS RULES:
- A student who only gives an example without defining the concept → WRONG (missing the definition).
- A student who lists 1 of 3 required steps → WRONG (missing steps).
- A student who states something factually incorrect → WRONG, even if other parts are fine.
- A student who copies the question text back → WRONG.
- A student who writes "I don't know" or unrelated text → WRONG, score 0.
- Paraphrasing, synonyms, English/Arabic mixing, minor typos → all FINE if meaning is intact.

LANGUAGE: Reply in the SAME language as the question. If question is Arabic → feedback in Arabic. If English → feedback in English. If mixed → Arabic.

FEEDBACK FORMAT (max 2 short sentences):
- If correct: brief praise + the strongest concept they nailed.
- If wrong: name the SPECIFIC concept(s) missing or wrong. Do NOT give away the full model answer — just point to the gap.

Respond with STRICT JSON only, no markdown fences, no extra text:
{
  "isCorrect": true | false,
  "score": 0-100,
  "keyConceptsFound": ["concept1", "concept2"],
  "keyConceptsMissing": ["concept3"],
  "feedback": "max 2 short sentences"
}`

    const userPrompt = `Question: ${question}

Model answer: ${modelAnswer}

Student's answer: ${userAnswer}

Grade the student's answer using the procedure above. Respond with JSON only.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const raw = completion.choices[0]?.message?.content ?? ''

    // ─── Parse the JSON response (3-level tolerant fallback) ───
    let isCorrect = false
    let score = 0
    let feedback = ''
    let conceptsFound: string[] = []
    let conceptsMissing: string[] = []

    const applyParsed = (parsed: any) => {
      isCorrect = Boolean(parsed.isCorrect)
      score = typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : (isCorrect ? 100 : 0)
      feedback = typeof parsed.feedback === 'string' ? parsed.feedback : ''
      if (Array.isArray(parsed.keyConceptsFound)) {
        conceptsFound = parsed.keyConceptsFound.filter((c: any) => typeof c === 'string').slice(0, 6)
      }
      if (Array.isArray(parsed.keyConceptsMissing)) {
        conceptsMissing = parsed.keyConceptsMissing.filter((c: any) => typeof c === 'string').slice(0, 6)
      }
    }

    // Level 1: direct parse
    try {
      applyParsed(JSON.parse(raw))
    } catch {
      // Level 2: extract first {...} block
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          applyParsed(JSON.parse(match[0]))
        } catch {
          // Level 3: keyword heuristics
          const lower = raw.toLowerCase()
          isCorrect = /"iscorrect"\s*:\s*true/.test(lower) && !/"iscorrect"\s*:\s*false/.test(lower)
          if (!isCorrect && /\b(wrong|incorrect|missing|partial)\b/.test(lower)) {
            isCorrect = false
          } else if (!isCorrect && /\bcorrect\b/.test(lower) && !/\b(wrong|incorrect)\b/.test(lower)) {
            isCorrect = true
          }
          score = isCorrect ? 100 : 0
          feedback = raw.slice(0, 200)
        }
      } else {
        // No JSON at all — last-ditch keyword scan
        const lower = raw.toLowerCase()
        isCorrect = /\bcorrect\b/.test(lower) && !/\b(wrong|incorrect)\b/.test(lower)
        score = isCorrect ? 100 : 0
        feedback = raw.slice(0, 200)
      }
    }

    // ─── Build a richer feedback message if AI's was sparse ───
    if (!feedback) {
      if (isCorrect) {
        feedback = '✓ Correct — your answer captures the key concepts.'
      } else {
        const missingHint = conceptsMissing.length > 0
          ? ` Missing: ${conceptsMissing.join(', ')}.`
          : ' Review the model answer and try again.'
        feedback = `✗ Not quite.${missingHint}`
      }
    } else if (!feedback.startsWith('✓') && !feedback.startsWith('✗')) {
      feedback = (isCorrect ? '✓ ' : '✗ ') + feedback
    }

    return NextResponse.json({
      isCorrect,
      score,
      feedback,
      conceptsFound,
      conceptsMissing,
      type: type || 'definition',
    })
  } catch (error) {
    console.error('check-answer error:', error)
    return NextResponse.json(
      {
        isCorrect: false,
        score: 0,
        feedback: 'Could not reach the AI grader. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
