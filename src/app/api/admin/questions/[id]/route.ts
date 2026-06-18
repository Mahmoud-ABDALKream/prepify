import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

function authorize(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

// ─── GET /api/admin/questions/[id] ───────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authorize(request)
  if (auth) return auth

  const { id } = await params
  const { data, error } = await getSupabaseAdmin()
    .from('Question')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  return NextResponse.json({ question: data })
}

// ─── PATCH /api/admin/questions/[id] ─────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authorize(request)
  if (auth) return auth

  const { id } = await params
  const body = await request.json()

  // Map camelCase → snake_case
  const update: Record<string, any> = { updated_at: new Date().toISOString() }
  const fieldMap: Record<string, string> = {
    subject: 'subject',
    section_id: 'section_id',
    question_id: 'question_id',
    text: 'text',
    marks: 'marks',
    type: 'type',
    codeBlock: 'code_block',
    fillItems: 'fill_items',
    mcqOptions: 'mcq_options',
    arrangeWords: 'arrange_words',
    translationDir: 'translation_dir',
    answer: 'answer',
    answerCode: 'answer_code',
    hint: 'hint',
    difficulty: 'difficulty',
    bloomTaxonomy: 'bloom_taxonomy',
    isPublished: 'is_published',
  }
  for (const [k, v] of Object.entries(body)) {
    if (fieldMap[k]) {
      update[fieldMap[k]] = v
    }
  }

  const { data, error } = await getSupabaseAdmin()
    .from('Question')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ question: data })
}

// ─── DELETE /api/admin/questions/[id] ────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = authorize(request)
  if (auth) return auth

  const { id } = await params
  const { error } = await getSupabaseAdmin()
    .from('Question')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
