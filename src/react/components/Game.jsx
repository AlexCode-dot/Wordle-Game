import { useState } from 'react'
import GameSetup from './GameSetup'
import GamePlay from './GamePlay'
import { startGameApi } from '../API/FetchGameStatus'

function Game() {
  const [gameState, setGameState] = useState('setup')
  const [wordLength, setWordLength] = useState(null)

  async function startGame(rules) {
    const result = await startGameApi(rules)
    if (result.success && result.data.gameStarted == true) {
      setWordLength(result.data.wordLength)
      setGameState('playing')
    }
    return result
  }

  return (
    <>
      {gameState === 'setup' && <GameSetup onStart={startGame} />}
      {gameState === 'playing' && <GamePlay wordLength={wordLength} />}
    </>
  )
}

export default Game
