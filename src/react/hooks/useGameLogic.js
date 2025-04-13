import { useState, useEffect } from 'react'
import { startGameApi } from '../API/FetchGameStatus.js'
import validateGuessApi from '../API/FetchGuessFeedback.js'
import fetchCorrectWord from '../API/FetchCorrectWord.js'
import { getGameStatus } from '../API/FetchGameSession.js'
import removeGameApi from '../API/RemoveGame.js'

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
        console.log('Session result:', result)

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
          setGameState('setup') // fallback to setup
        }
      } catch (err) {
        console.error('Restore session failed:', err)
        setGameState('setup') // fallback
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
    console.log(result)
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
      setWinningGuess(result.data)
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
