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

// ─── GET /api/admin/sections ─────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = authorize(request)
  if (auth) return auth

  const url = new URL(request.url)
  const subject = url.searchParams.get('subject')

  let query = getSupabaseAdmin().from('Section').select('*', { count: 'exact' })
  if (subject) query = query.eq('subject', subject)
  query = query.order('subject').order('section_id')

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ sections: data })
}

// ─── POST /api/admin/sections ────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = authorize(request)
  if (auth) return auth

  const body = await request.json()
  const required = ['subject', 'section_id', 'title']
  for (const f of required) {
    if (!body[f]) return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('Section')
    .upsert({
      subject:    body.subject,
      section_id: Number(body.section_id),
      title:      body.title,
      marks:      body.marks ?? '',
      icon:       body.icon ?? '📝',
    }, { onConflict: 'subject,section_id' })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ section: data?.[0] }, { status: 201 })
}
