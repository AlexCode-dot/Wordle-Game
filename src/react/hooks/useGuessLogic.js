import { useState, useRef } from 'react'

export function useGuessLogic(wordLength, processGuess, initialFeedback) {
  const inputRef = useRef(null)
  const [guessWordsFeedback, setGuessWordsFeedback] = useState(initialFeedback)
  const [error, setError] = useState(null)

  async function handleGuess() {
    setError(null)
    const input = inputRef.current.value.trim()

    if (input.length !== wordLength) {
      setError('Your guess must match the word length.')
      return
    }

    try {
      const result = await processGuess(input)
      if (!result.success) {
        setError(result.error)
        return
      }

      setGuessWordsFeedback((prev) => [...prev, result.data])
      inputRef.current.value = ''
    } catch (err) {
      setError('Something went wrong. Try again.')
    }
  }

  return {
    inputRef,
    guessWordsFeedback,
    error,
    handleGuess,
  }
}
