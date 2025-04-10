import React from 'react'
import RenderGuessWordsFeedback from './GuessWordsFeedback.jsx'
import InfoButton from './InfoButton.jsx'
import GuessInput from './GuessInput.jsx'
import RenderGuessCount from './RenderGuessCount.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import EndGameButton from './EndGameButton.jsx'
import { useGuessLogic } from '../hooks/useGuessLogic.js'

function GamePlay({ wordLength, processGuess, endGame, guessCount, initialFeedback }) {
  const { inputRef, guessWordsFeedback, error, handleGuess } = useGuessLogic(wordLength, processGuess, initialFeedback)

  return (
    <div className="game-play">
      <EndGameButton endGame={endGame} />
      <InfoButton wordLength={wordLength} />
      <RenderGuessCount guessCount={guessCount} />
      <RenderGuessWordsFeedback guessWordsFeedback={guessWordsFeedback} wordLength={wordLength} />
      <GuessInput inputRef={inputRef} wordLength={wordLength} onGuess={handleGuess} />
      <ErrorMessage error={error} />
    </div>
  )
}

export default GamePlay
