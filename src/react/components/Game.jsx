import { useState } from 'react'
import GameSetup from './GameSetup'
import { startGameApi } from '../API/FetchGameStatus'

function Game() {
  const [gameState, setGameState] = useState('setup')

  async function startGame(rules) {
    const result = await startGameApi(rules)
    if (result.success && result.data.gameStarted == true) {
      setGameState('playing')
    }
    return result // Skickar ev. felmeddelande tillbaka till GameSetup
  }

  return <>{gameState === 'setup' && <GameSetup onStart={startGame} />}</>
}

export default Game
