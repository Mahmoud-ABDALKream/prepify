/**
 * Review Store — localStorage-based persistence for wrong & starred questions.
 *
 * Data shape in localStorage (key = "prepify-review"):
 * {
 *   "c-programming": {
 *     subjectName: "C Programming",
 *     wrong:   { "12": { question }, "45": { question }, ... },
 *     starred: { "3": { question },  "7": { question },  ... }
 *   },
 *   "cyber-security-2": { ... },
 *   "iot": { ... }
 * }
 *
 * "wrong"   = questions the user answered incorrectly (auto-saved on submit)
 * "starred" = questions the user manually bookmarked (star button)
 *
 * Both are keyed by question-id so duplicates are impossible and removal is O(1).
 */

export interface ReviewQuestion {
  id: number
  text: string
  marks: string
  type: 'code' | 'trace' | 'fill' | 'mcq' | 'tf'
  codeBlock?: string
  fillItems?: { label: string; answer: string }[]
  mcqOptions?: { letter: string; text: string; isCorrect: boolean }[]
  answer: string
  answerCode?: string
  hint?: string
  // extra context saved at review time
  userAnswer?: string        // what the user answered (for reference)
  sectionTitle?: string      // which section this question belongs to
}

export interface SubjectReview {
  subjectName: string
  wrong: Record<string, ReviewQuestion>    // keyed by question id
  starred: Record<string, ReviewQuestion>  // keyed by question id
}

export type ReviewData = Record<string, SubjectReview>

const STORAGE_KEY = 'prepify-review'

// ─── Helpers ──────────────────────────────────────────

function readData(): ReviewData {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeData(data: ReviewData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* quota exceeded — ignore */ }
}

function ensureSubject(data: ReviewData, subjectKey: string, subjectName: string): SubjectReview {
  if (!data[subjectKey]) {
    data[subjectKey] = { subjectName, wrong: {}, starred: {} }
  }
  return data[subjectKey]
}

// ─── Public API ───────────────────────────────────────

/** Toggle the star on a question. Returns new starred state (true = now starred). */
export function toggleStar(
  subjectKey: string,
  subjectName: string,
  question: ReviewQuestion,
): boolean {
  const data = readData()
  const subject = ensureSubject(data, subjectKey, subjectName)
  const qId = String(question.id)
  if (subject.starred[qId]) {
    delete subject.starred[qId]
    writeData(data)
    return false
  } else {
    subject.starred[qId] = { ...question }
    writeData(data)
    return true
  }
}

/** Check if a question is starred. */
export function isStarred(subjectKey: string, questionId: number): boolean {
  const data = readData()
  return !!data[subjectKey]?.starred[String(questionId)]
}

/** Save a wrong question (called on quiz submit for each wrong answer). */
export function saveWrongQuestion(
  subjectKey: string,
  subjectName: string,
  question: ReviewQuestion,
): void {
  const data = readData()
  const subject = ensureSubject(data, subjectKey, subjectName)
  subject.wrong[String(question.id)] = { ...question }
  writeData(data)
}

/** Remove a wrong question (e.g. if user re-took and answered correctly). */
export function removeWrongQuestion(
  subjectKey: string,
  questionId: number,
): void {
  const data = readData()
  if (data[subjectKey]?.wrong) {
    delete data[subjectKey].wrong[String(questionId)]
    writeData(data)
  }
}

/** Save all wrong questions for a subject at once (replaces existing wrong list). */
export function saveAllWrongQuestions(
  subjectKey: string,
  subjectName: string,
  questions: ReviewQuestion[],
): void {
  const data = readData()
  const subject = ensureSubject(data, subjectKey, subjectName)
  subject.wrong = {}
  questions.forEach(q => {
    subject.wrong[String(q.id)] = { ...q }
  })
  writeData(data)
}

/** Also remove questions that are no longer wrong (user got them right on retake). */
export function syncWrongQuestions(
  subjectKey: string,
  subjectName: string,
  currentWrongIds: number[],
  allQuestionsMap: Record<number, ReviewQuestion>,
): void {
  const data = readData()
  const subject = ensureSubject(data, subjectKey, subjectName)

  // Remove previously-wrong questions that are now correct
  const currentWrongSet = new Set(currentWrongIds.map(String))
  Object.keys(subject.wrong).forEach(qId => {
    if (!currentWrongSet.has(qId)) {
      delete subject.wrong[qId]
    }
  })

  // Add new wrong questions
  currentWrongIds.forEach(qId => {
    const q = allQuestionsMap[qId]
    if (q) {
      subject.wrong[String(qId)] = { ...q }
    }
  })

  writeData(data)
}

/** Get all review data. */
export function getReviewData(): ReviewData {
  return readData()
}

/** Get review data for a single subject. */
export function getSubjectReview(subjectKey: string): SubjectReview | null {
  const data = readData()
  return data[subjectKey] || null
}

/** Get total counts for badge display. */
export function getReviewCounts(subjectKey: string): { wrong: number; starred: number; total: number } {
  const data = readData()
  const subject = data[subjectKey]
  if (!subject) return { wrong: 0, starred: 0, total: 0 }
  const wrong = Object.keys(subject.wrong).length
  const starred = Object.keys(subject.starred).length
  // Deduplicate: a question can be both wrong and starred
  const starredIds = new Set(Object.keys(subject.starred))
  const wrongIds = new Set(Object.keys(subject.wrong))
  const uniqueIds = new Set([...starredIds, ...wrongIds])
  return { wrong, starred, total: uniqueIds.size }
}

/** Get total counts across ALL subjects. */
export function getTotalReviewCounts(): { wrong: number; starred: number; total: number } {
  const data = readData()
  let wrong = 0
  let starred = 0
  const allIds = new Set<string>()
  Object.entries(data).forEach(([key, subject]) => {
    Object.keys(subject.wrong).forEach(id => allIds.add(`${key}:${id}`))
    Object.keys(subject.starred).forEach(id => allIds.add(`${key}:${id}`))
    wrong += Object.keys(subject.wrong).length
    starred += Object.keys(subject.starred).length
  })
  return { wrong, starred, total: allIds.size }
}

/** Clear all review data for a subject (used on "Try Again" full reset). */
export function clearSubjectReview(subjectKey: string): void {
  const data = readData()
  if (data[subjectKey]) {
    // Keep starred, only clear wrong (user may still want starred after retake)
    data[subjectKey].wrong = {}
    writeData(data)
  }
}

/** Remove a specific starred question. */
export function removeStarred(subjectKey: string, questionId: number): void {
  const data = readData()
  if (data[subjectKey]?.starred) {
    delete data[subjectKey].starred[String(questionId)]
    writeData(data)
  }
}

/** Remove a specific wrong question from review. */
export function removeWrong(subjectKey: string, questionId: number): void {
  const data = readData()
  if (data[subjectKey]?.wrong) {
    delete data[subjectKey].wrong[String(questionId)]
    writeData(data)
  }
}
