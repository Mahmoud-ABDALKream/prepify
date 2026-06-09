import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/feedback — retrieve all feedback (requires admin secret)
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error('Failed to fetch feedback:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}

// POST /api/feedback — submit new feedback (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, rating, subject } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    // Email is optional - use placeholder if not provided
    const emailValue = (email && typeof email === 'string' && email.trim().length > 0) ? email.trim() : 'no-email@provided'
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const feedback = await prisma.feedback.create({
      data: {
        name: name.trim(),
        email: emailValue,
        message: message.trim(),
        rating,
        subject: subject || null,
      },
    })

    return NextResponse.json({ feedback }, { status: 201 })
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
