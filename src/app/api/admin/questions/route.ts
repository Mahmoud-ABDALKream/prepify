import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// ─── Auth gate ───────────────────────────────────────────────
function authorize(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

// ─── GET /api/admin/questions ────────────────────────────────
// Query params: subject?, section_id?, type?, difficulty?, is_published?, q?, limit?, offset?
export async function GET(request: NextRequest) {
  const auth = authorize(request)
  if (auth) return auth

  try {
    const url = new URL(request.url)
    const params = url.searchParams

    let query = getSupabaseAdmin()
      .from('Question')
      .select('*', { count: 'exact' })

    if (params.get('subject'))      query = query.eq('subject', params.get('subject'))
    if (params.get('section_id'))   query = query.eq('section_id', Number(params.get('section_id')))
    if (params.get('type'))         query = query.eq('type', params.get('type'))
    if (params.get('difficulty'))   query = query.eq('difficulty', params.get('difficulty'))
    if (params.get('is_published')) query = query.eq('is_published', params.get('is_published') === 'true')
    if (params.get('q')) {
      query = query.or(`text.ilike.%${params.get('q')}%,answer.ilike.%${params.get('q')}%`)
    }

    const limit  = Math.min(200, Number(params.get('limit')  ?? 100))
    const offset = Math.max(0,    Number(params.get('offset') ?? 0))
    query = query.order('subject').order('section_id').order('question_id').range(offset, offset + limit - 1)

    const { data, count, error } = await query
    if (error) {
      console.error('Failed to fetch questions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ questions: data, total: count ?? 0 })
  } catch (e) {
    console.error('admin/questions GET error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// ─── POST /api/admin/questions ───────────────────────────────
// Create a new question. Body: full question payload.
export async function POST(request: NextRequest) {
  const auth = authorize(request)
  if (auth) return auth

  try {
    const body = await request.json()
    const required = ['subject', 'section_id', 'question_id', 'text', 'type', 'answer']
    for (const f of required) {
      if (body[f] === undefined || body[f] === null || body[f] === '') {
        return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 })
      }
    }

    const row = {
      subject:         body.subject,
      section_id:      Number(body.section_id),
      question_id:     Number(body.question_id),
      text:            body.text,
      marks:           body.marks ?? '',
      type:            body.type,
      code_block:      body.codeBlock ?? null,
      fill_items:      body.fillItems ?? null,
      mcq_options:     body.mcqOptions ?? null,
      arrange_words:   body.arrangeWords ?? null,
      translation_dir: body.translationDir ?? null,
      answer:          body.answer,
      answer_code:     body.answerCode ?? null,
      hint:            body.hint ?? null,
      difficulty:      body.difficulty ?? null,
      bloom_taxonomy:  body.bloomTaxonomy ?? null,
      is_published:    body.isPublished ?? true,
      created_by:      body.createdBy ?? 'admin',
    }

    const { data, error } = await getSupabaseAdmin()
      .from('Question')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Failed to create question:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ question: data }, { status: 201 })
  } catch (e) {
    console.error('admin/questions POST error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
