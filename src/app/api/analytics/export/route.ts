import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'csv'

    const allAttempts = await prisma.quizAttempt.findMany({ orderBy: { attemptDate: 'desc' } })
    const allExamResults = await prisma.examResult.findMany({ orderBy: { examDate: 'desc' } })

    if (type === 'csv') {
      return exportCSV(allAttempts, allExamResults)
    }

    return NextResponse.json({ error: 'Export type not yet supported. Use type=csv.' }, { status: 400 })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

function exportCSV(attempts: any[], examResults: any[]) {
  const headers = ['Type', 'ID', 'User ID', 'User Name', 'Subject', 'Quiz ID', 'Score', 'Correct Answers', 'Wrong Answers', 'Total Questions', 'Question Type', 'Time Taken (s)', 'Date', 'Exam Score', 'Pass/Fail', 'Grade Category']
  const rows: string[][] = []
  for (const a of attempts) { rows.push(['Quiz Attempt', a.id, a.userId, a.userName, a.subject, a.quizId, a.score.toString(), a.correctAnswers.toString(), a.wrongAnswers.toString(), a.totalQuestions.toString(), a.questionType, a.timeTaken.toString(), new Date(a.attemptDate).toISOString(), '', '', '']) }
  for (const e of examResults) { rows.push(['Exam Result', e.id, e.userId, e.userName, e.subject, '', '', '', '', '', '', '', new Date(e.examDate).toISOString(), e.examScore.toString(), e.passFail, e.gradeCategory]) }
  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n')
  return new NextResponse(csvContent, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="prepify-analytics-${new Date().toISOString().split('T')[0]}.csv"` } })
}
