'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080c18' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-4"
        >
          ⚡
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-300 mb-2">Something went wrong!</h2>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
        >
          Try Again
        </button>
      </motion.div>
    </div>
  )
}
