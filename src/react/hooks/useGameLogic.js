import { useState, useEffect } from 'react'
import { startGameApi } from '../api/FetchGameStatus.js'
import validateGuessApi from '../api/FetchGuessFeedback.js'
import fetchCorrectWord from '../api/FetchCorrectWord.js'
import { getGameStatus } from '../api/FetchGameSession.js'
import removeGameApi from '../api/RemoveGame.js'

export function useGameLogic() {
  const [gameState, setGameState] = useState('setup')
  const [wordLength, setWordLength] = useState(null)
  const [winningGuess, setWinningGuess] = useState(null)
  const [guessCount, setGuessCount] = useState(0)
  const [guessWordsFeedback, setGuessWordsFeedback] = useState([])
  const [gameTime, setGameTime] = useState(null)

  useEffect(() => {
    async function restoreSession() {
      try {
        const result = await getGameStatus()

        if (result.success && result.data.gameStarted) {
          setGameState(result.data.state || 'playing')

          if (result.data.state === 'win' && result.data.winningFeedback) {
            setWinningGuess([result.data.winningFeedback])
            setGameTime(result.data.timeTaken)
          }
          setWordLength(result.data.rules.wordLength)
          setGuessCount(result.data.guesses?.length || 0)

          console.log('Formatted Guesses:', result.data.guesses)
          setGuessWordsFeedback(result.data.guesses)
        } else {
          setGameState('setup')
        }
      } catch (err) {
        console.error('Restore session failed:', err)
        setGameState('setup')
      }
    }
    restoreSession()
  }, [])

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
    if (result.success && Array.isArray(result.data.letterFeedback)) {
      if (result.data.gameWon) {
        setWinningGuess([result.data.letterFeedback])
        setGameTime(result.data.timeTaken)
        setGameState('win')
      }
      setGuessCount((prev) => prev + 1)
    }
    return result
  }

  async function endGame() {
    const result = await fetchCorrectWord()
    if (result.success && result.data) {
      setWinningGuess(result.data.correctWord)
      setGameState('lose')
    }
  }

  async function restartGame() {
    const result = await removeGameApi()
    console.log('Game reset response:', result.data.message)
    if (result.success && result.data) {
      setGameState('setup')
      setGuessWordsFeedback([])
    }
  }
  return {
    gameState,
    wordLength,
    winningGuess,
    guessCount,
    gameTime,
    guessWordsFeedback,
    startGame,
    validateWin,
    endGame,
    restartGame,
  }
}
