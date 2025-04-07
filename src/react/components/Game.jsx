import { useGameLogic } from '../hooks/useGameLogic.js'
import GameSetup from './GameSetup.jsx'
import GamePlay from './GamePlay.jsx'
import GameWon from './GameWon.jsx'
import GameLose from './GameLose.jsx'

function Game() {
  const { gameState, wordLength, winningGuess, guessCount, guessWordsFeedback, startGame, validateWin, endGame } = useGameLogic()

  return (
    <>
      {gameState === 'setup' && <GameSetup onStart={startGame} />}
      {gameState === 'playing' && (
        <GamePlay processGuess={validateWin} wordLength={wordLength} endGame={endGame} guessCount={guessCount} initialFeedback={guessWordsFeedback}/>
      )}
      {gameState === 'win' && <GameWon winningGuess={winningGuess} wordLength={wordLength} guessCount={guessCount} />}
      {gameState === 'lose' && <GameLose correctWord={winningGuess} />}
    </>
  )
}

export default Game
