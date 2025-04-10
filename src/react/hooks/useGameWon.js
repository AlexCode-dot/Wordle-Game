import { useState } from 'react'
import postScore from '../API/postScore.js'

export function useGameWon() {
  const [name, setName] = useState('')

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handlePostScore = () => {
    postScore(name)
  }

  return {
    name,
    handleNameChange,
    handlePostScore,
  }
}
