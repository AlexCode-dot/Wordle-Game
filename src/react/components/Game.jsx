import { useGameLogic } from '../hooks/useGameLogic.js'
import GameSetup from './GameSetup.jsx'
import GamePlay from './GamePlay.jsx'
import GameWon from './GameWon.jsx'

function Game() {
  const { gameState, wordLength, winningGuess, startGame, validateWin } = useGameLogic()

  return (
    <>
      {gameState === 'setup' && <GameSetup onStart={startGame} />}
      {gameState === 'playing' && <GamePlay processGuess={validateWin} wordLength={wordLength} />}
      {gameState === 'win' && <GameWon winningGuess={winningGuess} wordLength={wordLength} />}
    </>
  )
}

export default Game
