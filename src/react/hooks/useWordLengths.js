import { useEffect, useState } from 'react'
import { fetchWordLengths } from '../api/FetchWordLengths.js'

export function useWordLengths(language) {
  const [wordLengths, setWordLengths] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWordLengths(language)
      .then(setWordLengths)
      .catch(() => setError('Could not fetch word lengths.'))
  }, [language])

  return { wordLengths, error }
}
