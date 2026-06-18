import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// ─── GET /api/questions?subject=msoffice ─────────────────────
// Public endpoint — returns all published sections + questions for a subject.
// Shape: { sections: Section[] } where each Section has .questions: Question[]
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const subject = url.searchParams.get('subject')

  if (!subject) {
    return NextResponse.json({ error: 'subject query param is required' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdmin()

    const [{ data: sections, error: secErr }, { data: questions, error: qErr }] = await Promise.all([
      supabase.from('Section').select('*').eq('subject', subject).order('section_id'),
      supabase.from('Question').select('*').eq('subject', subject).eq('is_published', true).order('section_id').order('question_id'),
    ])

    if (secErr) return NextResponse.json({ error: secErr.message }, { status: 500 })
    if (qErr)  return NextResponse.json({ error: qErr.message },  { status: 500 })

    // Group questions by section
    const questionsBySection = new Map<number, any[]>()
    for (const q of questions ?? []) {
      const arr = questionsBySection.get(q.section_id) ?? []
      arr.push(q)
      questionsBySection.set(q.section_id, arr)
    }

    const result = (sections ?? []).map(s => ({
      id:        s.section_id,
      title:     s.title,
      marks:     s.marks,
      icon:      s.icon,
      questions: (questionsBySection.get(s.section_id) ?? []).map(q => ({
        id:             q.question_id,
        text:           q.text,
        marks:          q.marks,
        type:           q.type,
        codeBlock:      q.code_block ?? undefined,
        fillItems:      q.fill_items ?? undefined,
        mcqOptions:     q.mcq_options ?? undefined,
        arrangeWords:   q.arrange_words ?? undefined,
        translationDir: q.translation_dir ?? undefined,
        answer:         q.answer,
        answerCode:     q.answer_code ?? undefined,
        hint:           q.hint ?? undefined,
        difficulty:     q.difficulty ?? undefined,
        bloomTaxonomy:  q.bloom_taxonomy ?? undefined,
      })),
    }))

    return NextResponse.json({ sections: result })
  } catch (e) {
    console.error('Public questions fetch error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
