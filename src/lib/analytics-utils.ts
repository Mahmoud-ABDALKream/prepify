import { prisma } from '@/lib/prisma'
import { todayCairo, yesterdayCairo, toCairoDayString, MS_PER_DAY } from '@/lib/date-utils'

// ─── Helpers ──────────────────────────────────────────

export function calcStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  const uniqueDays = [...new Set(dates.map(d => toCairoDayString(d)))].sort().reverse()
  if (uniqueDays.length === 0) return 0
  const today = todayCairo()
  const yesterday = yesterdayCairo()
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = (new Date(uniqueDays[i - 1]).getTime() - new Date(uniqueDays[i]).getTime()) / MS_PER_DAY
    if (Math.abs(diff - 1) < 0.5) streak++
    else break
  }
  return streak
}

export function consistencyBonus(scores: number[]): number {
  if (scores.length < 2) return 0.5
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const stdDev = Math.sqrt(scores.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / scores.length)
  return Math.max(0, Math.min(1, 1 - stdDev / 30))
}

export function pearson(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  if (n < 3) return 0
  const xs = x.slice(0, n), ys = y.slice(0, n)
  const xm = xs.reduce((a, b) => a + b, 0) / n, ym = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < n; i++) { const dx = xs[i] - xm, dy = ys[i] - ym; num += dx * dy; dx2 += dx * dx; dy2 += dy * dy }
  const den = Math.sqrt(dx2 * dy2)
  return den === 0 ? 0 : num / den
}

export function linReg(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
  const n = Math.min(x.length, y.length)
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }
  const xs = x.slice(0, n), ys = y.slice(0, n)
  const xm = xs.reduce((a, b) => a + b, 0) / n, ym = ys.reduce((a, b) => a + b, 0) / n
  let sxx = 0, sxy = 0, syy = 0
  for (let i = 0; i < n; i++) { const dx = xs[i] - xm, dy = ys[i] - ym; sxx += dx * dx; sxy += dx * dy; syy += dy * dy }
  const slope = sxx !== 0 ? sxy / sxx : 0
  return { slope, intercept: ym - slope * xm, r2: syy !== 0 ? (sxy * sxy) / (sxx * syy) : 0 }
}

export interface UserStats {
  id: string
  name: string
  att: number
  q: number
  c: number
  w: number
  best: number
  scores: number[]
  subjs: Set<string>
  qtypes: Map<string, { t: number; c: number; s: number[] }>
  time: number
  dates: Date[]
  streak: number
  last: Date | null
  exams: { score: number; subject: string; pf: string }[]
}

export async function getUserStats(): Promise<Map<string, UserStats>> {
  const attempts = await prisma.quizAttempt.findMany({ orderBy: { attemptDate: 'asc' } })
  const exams = await prisma.examResult.findMany()

  const map = new Map<string, UserStats>()

  for (const a of attempts) {
    const e = map.get(a.userId)
    if (e) {
      e.att++; e.q += a.totalQuestions; e.c += a.correctAnswers; e.w += a.wrongAnswers
      e.scores.push(a.score); if (a.score > e.best) e.best = a.score
      e.subjs.add(a.subject); e.time += a.timeTaken; e.dates.push(a.attemptDate)
      const qt = e.qtypes.get(a.questionType) || { t: 0, c: 0, s: [] }
      qt.t += a.totalQuestions; qt.c += a.correctAnswers; qt.s.push(a.score)
      e.qtypes.set(a.questionType, qt)
    } else {
      const qm = new Map<string, { t: number; c: number; s: number[] }>()
      qm.set(a.questionType, { t: a.totalQuestions, c: a.correctAnswers, s: [a.score] })
      map.set(a.userId, {
        id: a.userId, name: a.userName, att: 1, q: a.totalQuestions, c: a.correctAnswers,
        w: a.wrongAnswers, best: a.score, scores: [a.score], subjs: new Set([a.subject]),
        qtypes: qm, time: a.timeTaken, dates: [a.attemptDate], streak: 1, last: a.attemptDate, exams: []
      })
    }
  }
  for (const ex of exams) { const u = map.get(ex.userId); if (u) u.exams.push({ score: ex.examScore, subject: ex.subject, pf: ex.passFail }) }
  for (const u of map.values()) {
    u.streak = calcStreak(u.dates)
    u.last = u.dates.length > 0 ? u.dates[u.dates.length - 1] : null
  }
  return map
}

export { prisma }
