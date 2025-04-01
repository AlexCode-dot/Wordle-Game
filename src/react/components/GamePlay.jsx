import React from 'react'
import RenderGuessWordsFeedback from './GuessWordsFeedback.jsx'
import InfoButton from './InfoButton.jsx'
import GuessInput from './GuessInput.jsx'
import GuessCount from './GuessCount.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import { useGuessLogic } from '../hooks/useGuessLogic.js'

function GamePlay({ wordLength, processGuess }) {
  const { inputRef, guessWordsFeedback, error, handleGuess } = useGuessLogic(wordLength, processGuess)

  return (
    <div className="game-play">
      <InfoButton wordLength={wordLength} />
      <GuessCount count={guessWordsFeedback.length} />
      <RenderGuessWordsFeedback guessWordsFeedback={guessWordsFeedback} wordLength={wordLength} />
      <GuessInput inputRef={inputRef} wordLength={wordLength} onGuess={handleGuess} />
      <ErrorMessage error={error} />
    </div>
  )
}

export default GamePlay
