import { useState } from 'react'
import postScore from '../api/PostScore.js'

export function useGameWon() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleNameChange = (e) => {
    const input = e.target.value

    // Remove spaces while typing
    const noSpaces = input.replace(/\s/g, '')

    // Limit to 20 characters
    if (noSpaces.length > 20) return

    setName(noSpaces)
    setError('')
  }

  const handlePostScore = async () => {
    if (!name) {
      setError('Name is required')
      return
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      setError('Name must contain only letters and numbers.')
      return
    }

    const response = await postScore(name)

    if (response.success) {
      window.location.href = '/leaderboard'
    } else {
      console.error('Error posting score:', response.error)
      setError('Failed to post score')
    }
  }

  return {
    name,
    error,
    handleNameChange,
    handlePostScore,
  }
}
