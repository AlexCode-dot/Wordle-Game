import { useState } from 'react'
import { startGameApi } from '../API/FetchGameStatus'
import validateGuessApi from '../API/FetchGuessFeedback.jsx'
import fetchCorrectWord from '../API/FetchCorrectWord.jsx'

export function useGameLogic() {
  const [gameState, setGameState] = useState('setup')
  const [wordLength, setWordLength] = useState(null)
  const [winningGuess, setWinningGuess] = useState(null)
  const [guessCount, setGuessCount] = useState(0) // Track guess count

  async function startGame(rules) {
    const result = await startGameApi(rules)
    if (result.success && result.data.gameStarted) {
      setWordLength(result.data.wordLength)
      setGameState('playing')
      setGuessCount(0) // Reset guess count
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
      setGuessCount((prev) => prev + 1) // Increment guess count
    }
    return result
  }

  async function endGame() {
    const result = await fetchCorrectWord()
    if (result.success && result.data) {
      setWinningGuess(result.data) // Store the correct word
      setGameState('lose')
    }
  }

  return { gameState, wordLength, winningGuess, guessCount, startGame, validateWin, endGame }
}
