'use client'

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">Machine Learning Predictions</h1>
        <p className="text-[#64748b] text-sm mt-1">Comparing Linear Regression, Decision Tree, and Random Forest models</p>
      </div>

      {data.message ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">🤖</div><h3 className="text-xl font-black mb-2">Insufficient Data</h3><p className="text-[#64748b] text-sm">{data.message}</p></div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Error Metrics (Lower is Better)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { model: 'Linear Reg', MAE: data.comparison.mae.linearRegression, RMSE: data.comparison.rmse.linearRegression },
                  { model: 'Decision Tree', MAE: data.comparison.mae.decisionTree, RMSE: data.comparison.rmse.decisionTree },
                  { model: 'Random Forest', MAE: data.comparison.mae.randomForest, RMSE: data.comparison.rmse.randomForest },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                  <Bar dataKey="MAE" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="RMSE" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4">Classification Metrics</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { model: 'Linear Reg', Accuracy: data.comparison.accuracy.linearRegression, Precision: data.comparison.precision.linearRegression, Recall: data.comparison.recall.linearRegression, F1: data.comparison.f1.linearRegression },
                  { model: 'Decision Tree', Accuracy: data.comparison.accuracy.decisionTree, Precision: data.comparison.precision.decisionTree, Recall: data.comparison.recall.decisionTree, F1: data.comparison.f1.decisionTree },
                  { model: 'Random Forest', Accuracy: data.comparison.accuracy.randomForest, Precision: data.comparison.precision.randomForest, Recall: data.comparison.recall.randomForest, F1: data.comparison.f1.randomForest },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 1]} />
                  <RechartsTooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', fontSize: 12 }} />
                  <Bar dataKey="Accuracy" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Precision" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Recall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="F1" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-bold mb-4">R-squared (Variance Explained)</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { model: 'Linear Regression', r2: data.comparison.r2.linearRegression },
                { model: 'Decision Tree', r2: data.comparison.r2.decisionTree },
                { model: 'Random Forest', r2: data.comparison.r2.randomForest },
              ].map(m => (
                <div key={m.model} className="text-center">
                  <div className="text-2xl font-black" style={{ color: m.r2 >= 0.7 ? '#10b981' : m.r2 >= 0.4 ? '#f59e0b' : '#64748b' }}>{(m.r2 * 100).toFixed(1)}%</div>
                  <div className="text-xs text-[#64748b]">{m.model}</div>
                  <div className="w-full h-2 bg-[#1e2d45] rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(m.r2 * 100, 2)}%`, background: m.r2 >= 0.7 ? '#10b981' : m.r2 >= 0.4 ? '#f59e0b' : '#64748b' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Per-Student Predictions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#64748b] text-xs uppercase tracking-wider">
                    <th className="text-left py-2 px-3">Student</th>
                    <th className="text-center py-2 px-3">Actual</th>
                    <th className="text-center py-2 px-3">Lin Reg</th>
                    <th className="text-center py-2 px-3">Decision Tree</th>
                    <th className="text-center py-2 px-3">Random Forest</th>
                    <th className="text-center py-2 px-3">Pass Prob</th>
                  </tr>
                </thead>
                <tbody>
                  {data.predictions.map((p, i) => (
                    <tr key={i} className="border-t border-[#1e2d45] hover:bg-[rgba(139,92,246,0.03)]">
                      <td className="py-2.5 px-3 font-medium">{p.userName}</td>
                      <td className="text-center py-2.5 px-3 font-bold">{p.actual}%</td>
                      <td className="text-center py-2.5 px-3" style={{ color: Math.abs(p.linearRegression - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.linearRegression}%</td>
                      <td className="text-center py-2.5 px-3" style={{ color: Math.abs(p.decisionTree - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.decisionTree}%</td>
                      <td className="text-center py-2.5 px-3" style={{ color: Math.abs(p.randomForest - p.actual) <= 5 ? '#10b981' : '#94a3b8' }}>{p.randomForest}%</td>
                      <td className="text-center py-2.5 px-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: p.passProbability >= 70 ? 'rgba(16,185,129,0.15)' : p.passProbability >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: p.passProbability >= 70 ? '#10b981' : p.passProbability >= 50 ? '#f59e0b' : '#ef4444' }}>{p.passProbability}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
