'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizTimerProps {
  minutes: number // 0 = no timer
  onTimeUp: () => void
  onTick?: (secondsLeft: number) => void
  paused?: boolean
}

export default function QuizTimer({ minutes, onTimeUp, onTick, paused = false }: QuizTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const rafRef = useRef<number | null>(null)
  const startTimestampRef = useRef<number>(0)   // absolute time when timer started
  const pausedElapsedRef = useRef<number>(0)     // elapsed seconds when pause began
  const onTimeUpRef = useRef(onTimeUp)
  const onTickRef = useRef(onTick)

  // Keep callback refs up-to-date without re-triggering the effect
  useEffect(() => { onTimeUpRef.current = onTimeUp }, [onTimeUp])
  useEffect(() => { onTickRef.current = onTick }, [onTick])

  // Reset when minutes change
  useEffect(() => {
    if (minutes === 0) return
    const totalSeconds = minutes * 60
    setSecondsLeft(totalSeconds)
    setIsTimeUp(false)
    startTimestampRef.current = Date.now()
    pausedElapsedRef.current = 0
  }, [minutes])

  // Main tick loop — uses requestAnimationFrame + real wall-clock time
  useEffect(() => {
    if (minutes === 0 || isTimeUp) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const totalSeconds = minutes * 60
    let lastTickSecond = -1

    const tick = () => {
      if (paused) {
        // Don't update while paused — just keep requesting frames
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const elapsedMs = Date.now() - startTimestampRef.current
      const elapsedSeconds = Math.floor(elapsedMs / 1000)
      const remaining = totalSeconds - elapsedSeconds - pausedElapsedRef.current

      if (remaining <= 0) {
        setSecondsLeft(0)
        setIsTimeUp(true)
        onTimeUpRef.current()
        return
      }

      setSecondsLeft(remaining)

      // Only call onTick once per real second
      if (remaining !== lastTickSecond) {
        lastTickSecond = remaining
        onTickRef.current?.(remaining)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [minutes, paused, isTimeUp])

  // Handle pause/resume — save elapsed time so the clock doesn't jump
  useEffect(() => {
    if (minutes === 0) return

    if (paused) {
      // Pausing: record how much real time has elapsed
      const elapsedMs = Date.now() - startTimestampRef.current
      pausedElapsedRef.current += Math.floor(elapsedMs / 1000)
      // Reset start timestamp so when we resume, we measure from resume point
      startTimestampRef.current = Date.now()
    } else if (startTimestampRef.current === 0 && pausedElapsedRef.current > 0) {
      // Resuming: set the start timestamp to now
      startTimestampRef.current = Date.now()
    }
  }, [paused, minutes])

  if (minutes === 0) return null

  const totalSeconds = minutes * 60
  const progress = secondsLeft / totalSeconds
  const hours = Math.floor(secondsLeft / 3600)
  const mins = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getColor = () => {
    if (progress > 0.5) return { main: '#22c55e', glow: 'rgba(34,197,94,0.3)' }      // green
    if (progress > 0.25) return { main: '#f59e0b', glow: 'rgba(245,158,11,0.3)' }     // amber
    if (progress > 0.1) return { main: '#f97316', glow: 'rgba(249,115,22,0.3)' }      // orange
    return { main: '#ef4444', glow: 'rgba(239,68,68,0.4)' }                             // red
  }

  const color = getColor()
  const isUrgent = progress <= 0.1 && secondsLeft > 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
          transition={isUrgent ? { repeat: Infinity, duration: 0.8 } : {}}
          className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{
            background: 'rgba(15,23,42,0.95)',
            border: `1px solid ${color.main}40`,
            boxShadow: `0 0 20px ${color.glow}, 0 4px 15px rgba(0,0,0,0.4)`,
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Circular progress */}
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2.5"
              />
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke={color.main}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${progress * 97.4} 97.4`}
                style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s ease' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: color.main }}>
              {Math.round(progress * 100)}%
            </span>
          </div>

          {/* Time display */}
          <div>
            <div className="text-lg font-mono font-bold tracking-wider" style={{ color: color.main }}>
              {formatTime()}
            </div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">
              {paused ? 'Paused' : isTimeUp ? 'Time Up!' : 'Remaining'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
