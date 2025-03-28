import { useState, useEffect } from 'react'

export function useWordLengths() {
  const [wordLengths, setWordLengths] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchWordLengths() {
      try {
        const response = await fetch('/api/word-lengths')
        if (!response.ok) {
          throw new Error('Failed to load word lengths.')
        }
        const lengths = await response.json()
        setWordLengths(lengths)
      } catch (err) {
        setError('Failed to load word lengths.')
      }
    }

    fetchWordLengths()
  }, [])

  return { wordLengths, error }
}
