import { useState } from 'react'
import { useWordLengths } from './useWordLengths.js'

export function useGameSetup(onStart) {
  const [language, setLanguage] = useState('en')
  const { wordLengths, error: fetchError } = useWordLengths(language)
  const [error, setError] = useState(null)
  const [selectedLength, setSelectedLength] = useState('')
  const [noDuplicates, setNoDuplicates] = useState(false)

  async function handleStart() {
    setError(null)

    if (!selectedLength) {
      setError('Please select a word length.')
      return
    }

    const rules = {
      wordLength: Number(selectedLength),
      noLetterDuplicate: noDuplicates,
      language,
    }

    const result = await onStart(rules)
    if (!result.success) {
      setError(result.error)
    }
  }

  return {
    wordLengths,
    fetchError,
    error,
    selectedLength,
    setSelectedLength,
    noDuplicates,
    setNoDuplicates,
    language,
    setLanguage,
    handleStart,
  }
}
