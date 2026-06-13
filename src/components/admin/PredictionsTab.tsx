'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface PredictionsData {
  comparison: { mae: Record<string, number>; rmse: Record<string, number>; r2: Record<string, number>; accuracy: Record<string, number>; precision: Record<string, number>; recall: Record<string, number>; f1: Record<string, number> }
  predictions: { userName: string; actual: number; linearRegression: number; decisionTree: number; randomForest: number; passProbability: number }[]
  message?: string
}

interface Props {
  data: PredictionsData | null
}

export default function PredictionsTab({ data }: Props) {
  if (!data) return null

  const r2Color = (v: number) => v >= 0.7 ? '#10b981' : v >= 0.4 ? '#f59e0b' : '#64748b'

  return (
    <div>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">
          Machine Learning Predictions
        </h1>
        <p className="text-[#64748b] text-sm mt-1.5">Comparing Linear Regression, Decision Tree, and Random Forest models</p>
      </motion.div>

      {data.message ? (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2">Insufficient Data</h3>
          <p className="text-[#64748b] text-sm max-w-sm mx-auto">{data.message}</p>
        </motion.div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
            <motion.div
              className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                </div>
                Error Metrics (Lower is Better)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { model: 'Linear Reg', MAE: data.comparison.mae.linearRegression, RMSE: data.comparison.rmse.linearRegression },
                  { model: 'Decision Tree', MAE: data.comparison.mae.decisionTree, RMSE: data.comparison.rmse.decisionTree },
                  { model: 'Random Forest', MAE: data.comparison.mae.randomForest, RMSE: data.comparison.rmse.randomForest },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                  <XAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                  <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                  <Bar dataKey="MAE" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="RMSE" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                Classification Metrics
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { model: 'Linear Reg', Accuracy: data.comparison.accuracy.linearRegression, Precision: data.comparison.precision.linearRegression, Recall: data.comparison.recall.linearRegression, F1: data.comparison.f1.linearRegression },
                  { model: 'Decision Tree', Accuracy: data.comparison.accuracy.decisionTree, Precision: data.comparison.precision.decisionTree, Recall: data.comparison.recall.decisionTree, F1: data.comparison.f1.decisionTree },
                  { model: 'Random Forest', Accuracy: data.comparison.accuracy.randomForest, Precision: data.comparison.precision.randomForest, Recall: data.comparison.recall.randomForest, F1: data.comparison.f1.randomForest },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4540" />
                  <XAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#1e2d4540' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 1]} axisLine={{ stroke: '#1e2d4540' }} />
                  <RechartsTooltip contentStyle={{ background: '#0c1222', border: '1px solid #1e2d45', borderRadius: '14px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
                  <Bar dataKey="Accuracy" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Precision" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Recall" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="F1" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* R-squared Section */}
          <motion.div
            className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              </div>
              R-squared (Variance Explained)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { model: 'Linear Regression', r2: data.comparison.r2.linearRegression, color: '#8b5cf6' },
                { model: 'Decision Tree', r2: data.comparison.r2.decisionTree, color: '#10b981' },
                { model: 'Random Forest', r2: data.comparison.r2.randomForest, color: '#06b6d4' },
              ].map((m, i) => (
                <motion.div
                  key={m.model}
                  className="relative rounded-xl p-4 overflow-hidden text-center"
                  style={{
                    background: `linear-gradient(135deg, ${m.color}08, ${m.color}03)`,
                    border: `1px solid ${m.color}18`,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${m.color}, transparent 70%)` }} />
                  <div className="relative text-2xl font-black" style={{ color: r2Color(m.r2) }}>{(m.r2 * 100).toFixed(1)}%</div>
                  <div className="relative text-xs text-[#64748b] font-medium mt-1">{m.model}</div>
                  <div className="relative w-full h-2 bg-[#1e2d45] rounded-full mt-3 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: r2Color(m.r2) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(m.r2 * 100, 2)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Per-Student Predictions Table */}
          <motion.div
            className="bg-[#0c1222]/80 backdrop-blur-sm border border-[#1e2d45]/60 rounded-2xl p-5 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              Per-Student Predictions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#475569] text-[11px] uppercase tracking-wider">
                    <th className="text-left py-3 px-3 font-bold">Student</th>
                    <th className="text-center py-3 px-3 font-bold">Actual</th>
                    <th className="text-center py-3 px-3 font-bold">Lin Reg</th>
                    <th className="text-center py-3 px-3 font-bold">Decision Tree</th>
                    <th className="text-center py-3 px-3 font-bold">Random Forest</th>
                    <th className="text-center py-3 px-3 font-bold">Pass Prob</th>
                  </tr>
                </thead>
                <tbody>
                  {data.predictions.map((p, i) => (
                    <tr key={i} className="border-t border-[#1e2d45]/40 hover:bg-[rgba(139,92,246,0.03)] transition-colors">
                      <td className="py-3 px-3 font-semibold">{p.userName}</td>
                      <td className="text-center py-3 px-3 font-bold">{p.actual}%</td>
                      <td className="text-center py-3 px-3" style={{ color: Math.abs(p.linearRegression - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.linearRegression}%</td>
                      <td className="text-center py-3 px-3" style={{ color: Math.abs(p.decisionTree - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.decisionTree}%</td>
                      <td className="text-center py-3 px-3" style={{ color: Math.abs(p.randomForest - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.randomForest}%</td>
                      <td className="text-center py-3 px-3">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{
                          background: p.passProbability >= 70 ? 'rgba(16,185,129,0.12)' : p.passProbability >= 50 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                          color: p.passProbability >= 70 ? '#10b981' : p.passProbability >= 50 ? '#f59e0b' : '#ef4444',
                          border: `1px solid ${p.passProbability >= 70 ? 'rgba(16,185,129,0.25)' : p.passProbability >= 50 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`,
                        }}>{p.passProbability}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
