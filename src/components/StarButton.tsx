'use client'

import { memo } from 'react'

interface StarButtonProps {
  isStarred: boolean
  onToggleStar: () => void
}

/**
 * Lightweight star toggle button — no Framer Motion, CSS-only animations.
 * React.memo ensures only the card whose star changed re-renders.
 */
const StarButton = memo(function StarButton({ isStarred, onToggleStar }: StarButtonProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggleStar() }}
      className="star-btn"
      data-starred={isStarred ? '1' : '0'}
      title={isStarred ? 'Remove from review' : 'Star for review'}
      type="button"
    >
      {isStarred ? '★' : '☆'}
    </button>
  )
})

export default StarButton
