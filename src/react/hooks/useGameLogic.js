import { useState } from 'react'
import { startGameApi } from '../API/FetchGameStatus.js'
import validateGuessApi from '../API/FetchGuessFeedback.js'
import fetchCorrectWord from '../API/FetchCorrectWord.js'

export function useGameLogic() {
  const [gameState, setGameState] = useState('setup')
  const [wordLength, setWordLength] = useState(null)
  const [winningGuess, setWinningGuess] = useState(null)
  const [guessCount, setGuessCount] = useState(0)

  async function startGame(rules) {
    const result = await startGameApi(rules)
    if (result.success && result.data.gameStarted) {
      setWordLength(result.data.wordLength)
      setGameState('playing')
      setGuessCount(0)
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
      setGuessCount((prev) => prev + 1)
    }
    return result
  }

  async function endGame() {
    const result = await fetchCorrectWord()
    if (result.success && result.data) {
      setWinningGuess(result.data)
      setGameState('lose')
    }
  }

  return { gameState, wordLength, winningGuess, guessCount, startGame, validateWin, endGame }
}
