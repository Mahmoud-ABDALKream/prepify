'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionRow {
  id: string
  subject: string
  section_id: number
  question_id: number
  text: string
  marks: string
  type: string
  answer: string
  difficulty: string | null
  bloom_taxonomy: string | null
  is_published: boolean
  hint: string | null
  updated_at: string
}

interface Props {
  password: string
}

const SUBJECTS = [
  { value: 'msoffice',            label: 'Microsoft Office' },
  { value: 'c-programming',       label: 'C Programming' },
  { value: 'iot',                 label: 'IoT' },
  { value: 'cyber-security-2',    label: 'Cyber Security 2' },
  { value: 'technical-english-2', label: 'Technical English 2' },
]

const TYPES = ['mcq', 'tf', 'fill', 'code', 'trace', 'definition', 'translation', 'arrange']
const DIFFICULTIES = ['easy', 'medium', 'hard']
const BLOOMS = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']

export default function QuestionsTab({ password }: Props) {
  const [questions, setQuestions] = useState<QuestionRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterSubject, setFilterSubject] = useState<string>('msoffice')
  const [filterType, setFilterType] = useState<string>('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('')
  const [searchQ, setSearchQ] = useState('')
  const [editing, setEditing] = useState<QuestionRow | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  // ─── Fetch questions ───
  const fetchQuestions = useCallback(async () => {
    if (!filterSubject) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ subject: filterSubject, limit: '200' })
      if (filterType)       params.set('type', filterType)
      if (filterDifficulty) params.set('difficulty', filterDifficulty)
      if (searchQ.trim())   params.set('q', searchQ.trim())
      const res = await fetch(`/api/admin/questions?${params}`, {
        headers: { 'x-admin-secret': password },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setQuestions(data.questions ?? [])
      setTotal(data.total ?? 0)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filterSubject, filterType, filterDifficulty, searchQ, password])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  // ─── Delete ───
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question? This cannot be undone.')) return
    const res = await fetch(`/api/admin/questions/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-secret': password },
    })
    if (res.ok) {
      setQuestions(prev => prev.filter(q => q.id !== id))
      setTotal(t => Math.max(0, t - 1))
    } else {
      alert('Failed to delete')
    }
  }

  // ─── Toggle publish ───
  const togglePublish = async (q: QuestionRow) => {
    const res = await fetch(`/api/admin/questions/${q.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': password },
      body: JSON.stringify({ isPublished: !q.is_published }),
    })
    if (res.ok) {
      const { question } = await res.json()
      setQuestions(prev => prev.map(p => p.id === q.id ? { ...p, is_published: question.is_published } : p))
    }
  }

  // ─── Save (create or update) ───
  const handleSave = async (payload: any, id?: string) => {
    const url = id ? `/api/admin/questions/${id}` : '/api/admin/questions'
    const method = id ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': password },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Save failed')
    await fetchQuestions()
    setEditing(null)
    setShowCreate(false)
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Question Bank</h2>
          <p className="text-sm text-slate-400 mt-1">
            {total} question{total !== 1 ? 's' : ''} stored in Supabase
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          + New Question
        </button>
      </div>

      {/* ─── Filters ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="bg-[#0d1320] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
        >
          {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-[#0d1320] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value)}
          className="bg-[#0d1320] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="">All Difficulty</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search text or answer..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          className="bg-[#0d1320] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <div className="text-center py-12 text-slate-400 text-sm">Loading questions…</div>
      )}

      {/* ─── List ─── */}
      {!loading && questions.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No questions found. Click "New Question" or run the seed script.
        </div>
      )}

      <div className="space-y-2">
        {questions.map(q => (
          <motion.div
            key={q.id}
            layout
            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 font-mono">
                    #{q.question_id}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300">
                    {q.type}
                  </span>
                  {q.difficulty && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                      {q.difficulty}
                    </span>
                  )}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    q.is_published
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-slate-500/15 text-slate-400'
                  }`}>
                    {q.is_published ? 'published' : 'draft'}
                  </span>
                  <span className="text-xs text-slate-500">
                    Section {q.section_id}
                  </span>
                </div>
                <p className="text-sm text-white line-clamp-2">{q.text}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Answer: <span className="text-slate-400">{q.answer}</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => setEditing(q)}
                  className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => togglePublish(q)}
                  className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  {q.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-xs px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Edit / Create Modal ─── */}
      <AnimatePresence>
        {(editing || showCreate) && (
          <QuestionEditor
            question={editing}
            defaultSubject={filterSubject}
            onClose={() => { setEditing(null); setShowCreate(false) }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Editor Modal ────────────────────────────────────────────
function QuestionEditor({
  question,
  defaultSubject,
  onClose,
  onSave,
}: {
  question: QuestionRow | null
  defaultSubject: string
  onClose: () => void
  onSave: (payload: any, id?: string) => Promise<void>
}) {
  const [form, setForm] = useState({
    subject: question?.subject ?? defaultSubject,
    section_id: question?.section_id ?? 1,
    question_id: question?.question_id ?? 1,
    text: question?.text ?? '',
    marks: question?.marks ?? '',
    type: question?.type ?? 'definition',
    answer: question?.answer ?? '',
    hint: question?.hint ?? '',
    difficulty: question?.difficulty ?? '',
    bloomTaxonomy: question?.bloom_taxonomy ?? '',
    isPublished: question?.is_published ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    setSaving(true)
    setErr(null)
    try {
      const payload: any = {
        subject:         form.subject,
        section_id:      Number(form.section_id),
        question_id:     Number(form.question_id),
        text:            form.text,
        marks:           form.marks,
        type:            form.type,
        answer:          form.answer,
        hint:            form.hint || undefined,
        difficulty:      form.difficulty || undefined,
        bloomTaxonomy:   form.bloomTaxonomy || undefined,
        isPublished:     form.isPublished,
      }
      await onSave(payload, question?.id)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0d1320] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-4">
          {question ? 'Edit Question' : 'New Question'}
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Subject">
            <select
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Type">
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Section ID">
            <input
              type="number"
              value={form.section_id}
              onChange={e => setForm(f => ({ ...f, section_id: Number(e.target.value) }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
          </Field>
          <Field label="Question ID (within section)">
            <input
              type="number"
              value={form.question_id}
              onChange={e => setForm(f => ({ ...f, question_id: Number(e.target.value) }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
          </Field>
          <Field label="Difficulty">
            <select
              value={form.difficulty}
              onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">—</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Bloom's Taxonomy">
            <select
              value={form.bloomTaxonomy}
              onChange={e => setForm(f => ({ ...f, bloomTaxonomy: e.target.value }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">—</option>
              {BLOOMS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Question Text" className="mb-3">
          <textarea
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            rows={3}
            className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-y"
          />
        </Field>

        <Field label="Model Answer" className="mb-3">
          <textarea
            value={form.answer}
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
            rows={4}
            className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-y font-mono"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Marks">
            <input
              type="text"
              value={form.marks}
              onChange={e => setForm(f => ({ ...f, marks: e.target.value }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
          </Field>
          <Field label="Hint (optional)">
            <input
              type="text"
              value={form.hint}
              onChange={e => setForm(f => ({ ...f, hint: e.target.value }))}
              className="w-full bg-[#080c18] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 mb-4 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
            className="accent-violet-500"
          />
          Published (visible to students)
        </label>

        {err && (
          <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {err}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || !form.text || !form.answer}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  )
}
