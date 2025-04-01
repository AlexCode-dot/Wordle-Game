import { useState } from 'react'
import { startGameApi } from '../API/FetchGameStatus'
import validateGuessApi from '../API/FetchGuessFeedback.jsx'

export function useGameLogic() {
  const [gameState, setGameState] = useState('setup')
  const [wordLength, setWordLength] = useState(null)
  const [winningGuess, setWinningGuess] = useState(null)

  async function startGame(rules) {
    const result = await startGameApi(rules)
    if (result.success && result.data.gameStarted) {
      setWordLength(result.data.wordLength)
      setGameState('playing')
    }
    return result
  }

  async function validateWin(guess) {
    const result = await validateGuessApi(guess)
    console.log(result)
    if (result.success && Array.isArray(result.data)) {
      const allCorrect = result.data.every((item) => item.result === 'correct')
      if (allCorrect) {
        setWinningGuess([result.data])
        setGameState('win')
      }
    }
    return result
  }

  return { gameState, wordLength, winningGuess, startGame, validateWin }
}
