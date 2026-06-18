/**
 * seed-questions.ts
 *
 * One-time seed script: imports all existing hardcoded questions
 * from /src/data/*-sections.ts into the Supabase Question + Section tables.
 *
 * Usage:
 *   npx tsx scripts/seed-questions.ts
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js'
import { msOfficeSections } from '../src/data/ms-office-sections'
import { cpSections } from '../src/data/cp-sections'
import { csSections } from '../src/data/cs-sections'
import { iotSections } from '../src/data/iot-sections'
import { te2Sections } from '../src/data/te2-sections'
import type { Section } from '../src/data/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SUBJECT_MAP: Record<string, { sections: Section[]; key: string }> = {
  'msoffice':           { sections: msOfficeSections, key: 'msoffice' },
  'c-programming':      { sections: cpSections,       key: 'c-programming' },
  'cyber-security-2':   { sections: csSections,       key: 'cyber-security-2' },
  'iot':                { sections: iotSections,      key: 'iot' },
  'technical-english-2':{ sections: te2Sections,      key: 'technical-english-2' },
}

async function seedSubject(subjectKey: string, sections: Section[]) {
  console.log(`\n📚 Seeding ${subjectKey} (${sections.length} sections)...`)

  // ─── Upsert sections ───
  const sectionRows = sections.map(s => ({
    subject:    subjectKey,
    section_id: s.id,
    title:      s.title,
    marks:      s.marks,
    icon:       s.icon,
  }))
  const { error: secErr } = await supabase
    .from('Section')
    .upsert(sectionRows, { onConflict: 'subject,section_id' })
  if (secErr) {
    console.error(`  ❌ Section upsert failed:`, secErr.message)
    return
  }
  console.log(`  ✓ ${sectionRows.length} sections upserted`)

  // ─── Upsert questions (in batches of 100) ───
  const questionRows: any[] = []
  for (const s of sections) {
    for (const q of s.questions) {
      questionRows.push({
        subject:         subjectKey,
        section_id:      s.id,
        question_id:     q.id,
        text:            q.text,
        marks:           q.marks,
        type:            q.type,
        code_block:      q.codeBlock ?? null,
        fill_items:      q.fillItems ?? null,
        mcq_options:     q.mcqOptions ?? null,
        arrange_words:   q.arrangeWords ?? null,
        translation_dir: q.translationDir ?? null,
        answer:          q.answer,
        answer_code:     q.answerCode ?? null,
        hint:            q.hint ?? null,
        difficulty:      q.difficulty ?? null,
        bloom_taxonomy:  q.bloomTaxonomy ?? null,
        is_published:    true,
      })
    }
  }

  const BATCH = 100
  let done = 0
  for (let i = 0; i < questionRows.length; i += BATCH) {
    const batch = questionRows.slice(i, i + BATCH)
    const { error } = await supabase
      .from('Question')
      .upsert(batch, { onConflict: 'subject,section_id,question_id' })
    if (error) {
      console.error(`  ❌ Batch ${i / BATCH + 1} failed:`, error.message)
    } else {
      done += batch.length
      process.stdout.write(`\r  ✓ ${done}/${questionRows.length} questions upserted`)
    }
  }
  console.log('')
}

async function main() {
  console.log(`🔗 Connecting to ${SUPABASE_URL}`)
  for (const [label, { sections, key }] of Object.entries(SUBJECT_MAP)) {
    await seedSubject(key, sections)
  }
  console.log('\n✅ Seed complete.')
}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})
