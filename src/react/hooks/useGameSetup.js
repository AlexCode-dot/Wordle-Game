import { useState } from 'react'
import { useWordLengths } from '../API/FetchWordLengths.js'

export function useGameSetup(onStart) {
  const { wordLengths, error: fetchError } = useWordLengths()
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
    handleStart,
  }
}
