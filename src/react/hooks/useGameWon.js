import { useState } from 'react'
import postScore from '../API/PostScore.js'

export function useGameWon() {
  const [name, setName] = useState('')

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handlePostScore = async () => {
    const response = await postScore(name)

    if (response.success) {
      window.location.href = '/leaderboard'
    } else {
      console.error('Error posting score:', response.error)
    }
  }

  return {
    name,
    handleNameChange,
    handlePostScore,
  }
}
