'use client'

import { memo, useCallback, useState } from 'react'

interface StarButtonProps {
  isStarred: boolean
  onToggleStar: () => void
}

/**
 * Optimized star toggle button — replaces the old Framer Motion implementation.
 *
 * Performance fixes (INP was 1,080 ms with the old motion.button + motion.span):
 *   1. React.memo — only the clicked card re-renders, not all 225+
 *   2. Plain <button> + CSS transitions — no Framer Motion overhead
 *   3. CSS @keyframes wiggle — runs on the compositor thread, never blocks main
 *   4. Animation key via state — forces CSS animation replay on every toggle
 */
const StarButton = memo(function StarButton({ isStarred, onToggleStar }: StarButtonProps) {
  // Bump a counter to force animation replay on each toggle
  const [animKey, setAnimKey] = useState(0)

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setAnimKey(k => k + 1)
    onToggleStar()
  }, [onToggleStar])

  return (
    <button
      onClick={handleClick}
      className="star-btn"
      data-starred={isStarred ? '1' : '0'}
      title={isStarred ? 'Remove from review' : 'Star for review'}
      type="button"
    >
      <span className="star-icon" key={animKey}>
        {isStarred ? '★' : '☆'}
      </span>
    </button>
  )
})

export default StarButton
