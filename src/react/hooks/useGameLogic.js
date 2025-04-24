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
  const [dbWarning, setDbWarning] = useState(null)

  useEffect(() => {
    async function restoreSession() {
      try {
        const result = await getGameStatus()

        if (result.success) {
          if (result.data.dbConnected === false) {
            setDbWarning('⚠️ Score saving and leaderboard access are currently unavailable due to server issues.')
          } else {
            setDbWarning(null)
          }

          if (result.data.gameStarted) {
            setGameState(result.data.state || 'playing')

            if (result.data.state === 'win' && result.data.winningFeedback) {
              setWinningGuess([result.data.winningFeedback])
              setGameTime(result.data.timeTaken)
            }
            setWordLength(result.data.rules.wordLength)
            setGuessCount(result.data.guesses?.length || 0)
            setGuessWordsFeedback(result.data.guesses)
          } else {
            setGameState('setup')
          }
        } else {
          setGameState('setup')
        }
      } catch (err) {
        console.error('Restore session failed:', err)
        setGameState('setup')
        setDbWarning('⚠️ Could not connect to the game server.')
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
    dbWarning,
  }
}
