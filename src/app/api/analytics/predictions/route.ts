import { getUserStats } from '@/lib/analytics-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await getUserStats()
    const uArr = Array.from(users.values())

    if (uArr.length < 3) return NextResponse.json({ comparison: { mae: {}, rmse: {}, r2: {}, accuracy: {}, precision: {}, recall: {}, f1: {} }, predictions: [], message: 'Insufficient data for ML predictions. Need at least 3 students.' })

    const features: number[][] = [], labels: number[] = [], names: string[] = []
    for (const u of uArr) {
      const avgAcc = u.q > 0 ? (u.c / u.q) * 100 : 0
      const avgScore = u.scores.reduce((a, b) => a + b, 0) / u.scores.length
      const examScore = u.exams.length > 0 ? u.exams.reduce((s, e) => s + e.score, 0) / u.exams.length : avgScore
      features.push([avgAcc, u.att, u.streak, u.subjs.size, avgScore, u.time / 60])
      labels.push(examScore); names.push(u.name)
    }

    const n = features.length, p = features[0].length
    const means = Array(p).fill(0), stds = Array(p).fill(1)
    for (let j = 0; j < p; j++) { const c = features.map(r => r[j]); means[j] = c.reduce((a, b) => a + b, 0) / n; stds[j] = Math.sqrt(c.reduce((s, v) => s + Math.pow(v - means[j], 2), 0) / n) || 1 }
    const normed = features.map(r => r.map((v, j) => (v - means[j]) / stds[j]))

    const w = Array(p + 1).fill(0)
    for (let ep = 0; ep < 500; ep++) { const g = Array(p + 1).fill(0); for (let i = 0; i < n; i++) { let pr = w[0]; for (let j = 0; j < p; j++) pr += w[j + 1] * normed[i][j]; const err = pr - labels[i]; g[0] += err / n; for (let j = 0; j < p; j++) g[j + 1] += (err * normed[i][j]) / n } for (let j = 0; j <= p; j++) w[j] -= 0.01 * g[j] }
    const lrPred = normed.map(r => { let pr = w[0]; for (let j = 0; j < p; j++) pr += w[j + 1] * r[j]; return Math.max(0, Math.min(100, pr)) })

    const accV = features.map(f => f[0])
    let bSplit = 0, bMSE = Infinity
    for (const sv of [...accV].sort((a, b) => a - b)) { const li = accV.map((v, i) => v <= sv ? i : -1).filter(i => i >= 0); const ri = accV.map((v, i) => v > sv ? i : -1).filter(i => i >= 0); if (li.length === 0 || ri.length === 0) continue; const lm = li.reduce((s, i) => s + labels[i], 0) / li.length; const rm = ri.reduce((s, i) => s + labels[i], 0) / ri.length; const mse = [...li.map(i => Math.pow(labels[i] - lm, 2)), ...ri.map(i => Math.pow(labels[i] - rm, 2))].reduce((a, b) => a + b, 0) / n; if (mse < bMSE) { bMSE = mse; bSplit = sv } }
    const dtPred = features.map(f => { const idx = accV.map((v, i) => (f[0] <= bSplit ? v <= bSplit : v > bSplit) ? i : -1).filter(i => i >= 0); return idx.length > 0 ? idx.reduce((s, i) => s + labels[i], 0) / idx.length : 50 })

    const tPreds: number[][] = []
    for (const sub of [[0, 1, 2], [0, 3, 4], [1, 2, 4], [0, 2, 5], [0, 1, 4]]) {
      const pf = sub[0], fv = features.map(f => f[pf]); let bs = 0, bm = Infinity
      for (const sv of [...fv].sort((a, b) => a - b)) { const li = fv.map((v, i) => v <= sv ? i : -1).filter(i => i >= 0); const ri = fv.map((v, i) => v > sv ? i : -1).filter(i => i >= 0); if (li.length === 0 || ri.length === 0) continue; const lm = li.reduce((s, i) => s + labels[i], 0) / li.length; const rm = ri.reduce((s, i) => s + labels[i], 0) / ri.length; const mse = [...li.map(i => Math.pow(labels[i] - lm, 2)), ...ri.map(i => Math.pow(labels[i] - rm, 2))].reduce((a, b) => a + b, 0) / n; if (mse < bm) { bm = mse; bs = sv } }
      tPreds.push(features.map(f => { const idx = fv.map((v, i) => (f[pf] <= bs ? v <= bs : v > bs) ? i : -1).filter(i => i >= 0); return idx.length > 0 ? idx.reduce((s, i) => s + labels[i], 0) / idx.length : 50 }))
    }
    const rfPred = features.map((_, i) => Math.max(0, Math.min(100, tPreds.reduce((s, p) => s + p[i], 0) / tPreds.length)))

    const mae = (a: number[], p: number[]) => a.reduce((s, v, i) => s + Math.abs(v - p[i]), 0) / a.length
    const rmse = (a: number[], p: number[]) => Math.sqrt(a.reduce((s, v, i) => s + Math.pow(v - p[i], 2), 0) / a.length)
    const r2 = (a: number[], p: number[]) => { const m = a.reduce((x, y) => x + y, 0) / a.length; const st = a.reduce((s, v) => s + Math.pow(v - m, 2), 0); const sr = a.reduce((s, v, i) => s + Math.pow(v - p[i], 2), 0); return st !== 0 ? 1 - sr / st : 0 }
    const cls = (a: number[], p: number[], t = 60) => { const ab = a.map(v => v >= t ? 1 : 0), pb = p.map(v => v >= t ? 1 : 0); const tp = ab.filter((v, i) => v === 1 && pb[i] === 1).length, fp = ab.filter((v, i) => v === 0 && pb[i] === 1).length, fn = ab.filter((v, i) => v === 1 && pb[i] === 0).length, tn = ab.filter((v, i) => v === 0 && pb[i] === 0).length; const ac = (tp + tn) / a.length, pr = tp + fp > 0 ? tp / (tp + fp) : 0, re = tp + fn > 0 ? tp / (tp + fn) : 0, f1 = pr + re > 0 ? 2 * pr * re / (pr + re) : 0; return { accuracy: ac, precision: pr, recall: re, f1 } }
    const lc = cls(labels, lrPred), dc = cls(labels, dtPred), rc = cls(labels, rfPred)

    return NextResponse.json({
      comparison: {
        mae: { linearRegression: Math.round(mae(labels, lrPred) * 100) / 100, decisionTree: Math.round(mae(labels, dtPred) * 100) / 100, randomForest: Math.round(mae(labels, rfPred) * 100) / 100 },
        rmse: { linearRegression: Math.round(rmse(labels, lrPred) * 100) / 100, decisionTree: Math.round(rmse(labels, dtPred) * 100) / 100, randomForest: Math.round(rmse(labels, rfPred) * 100) / 100 },
        r2: { linearRegression: Math.round(r2(labels, lrPred) * 1000) / 1000, decisionTree: Math.round(r2(labels, dtPred) * 1000) / 1000, randomForest: Math.round(r2(labels, rfPred) * 1000) / 1000 },
        accuracy: { linearRegression: Math.round(lc.accuracy * 1000) / 1000, decisionTree: Math.round(dc.accuracy * 1000) / 1000, randomForest: Math.round(rc.accuracy * 1000) / 1000 },
        precision: { linearRegression: Math.round(lc.precision * 1000) / 1000, decisionTree: Math.round(dc.precision * 1000) / 1000, randomForest: Math.round(rc.precision * 1000) / 1000 },
        recall: { linearRegression: Math.round(lc.recall * 1000) / 1000, decisionTree: Math.round(dc.recall * 1000) / 1000, randomForest: Math.round(rc.recall * 1000) / 1000 },
        f1: { linearRegression: Math.round(lc.f1 * 1000) / 1000, decisionTree: Math.round(dc.f1 * 1000) / 1000, randomForest: Math.round(rc.f1 * 1000) / 1000 },
      },
      predictions: names.map((name, i) => ({ userName: name, actual: Math.round(labels[i] * 10) / 10, linearRegression: Math.round(lrPred[i] * 10) / 10, decisionTree: Math.round(dtPred[i] * 10) / 10, randomForest: Math.round(rfPred[i] * 10) / 10, passProbability: Math.round(Math.min(100, rfPred[i]) * 10) / 10 })),
    })
  } catch (error) {
    console.error('Analytics predictions error:', error)
    return NextResponse.json({ error: 'Failed to compute predictions', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
