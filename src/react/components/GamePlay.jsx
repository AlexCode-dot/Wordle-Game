import React, { useState, useRef } from 'react'
import RenderGuessWordsFeedback from './GuessWordsFeedback.jsx'
import InfoButton from './InfoButton.jsx'

function GamePlay({ wordLength, processGuess }) {
  const inputRef = useRef(null)
  const [guessWordsFeedback, setGuessWordsFeedback] = useState([])
  const [error, setError] = useState(null)

  async function handleGuess() {
    setError(null)
    const input = inputRef.current.value.trim()

    if (input.length !== wordLength) {
      setError('Your guess must match the word length.')
      return
    }

    try {
      const result = await processGuess(input)
      console.log(result)
      if (!result.success) {
        setError(result.error)
        return
      }

      if (result.success && result.data === false) {
        setError('Your guess was not valid, try another word.')
        return
      }

      console.log(result.data)
      setGuessWordsFeedback((prev) => [...prev, result.data])
      inputRef.current.value = ''
    } catch (err) {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className="game-play">
      <InfoButton wordLength={wordLength} />
      <p className="game-play__guess-count">Guess count: {guessWordsFeedback.length}</p>
      <RenderGuessWordsFeedback guessWordsFeedback={guessWordsFeedback} wordLength={wordLength} />
      <label className="game-play__input-label" htmlFor="guess-input">
        Guess
      </label>
      <div className="game-play__input-container">
        <input
          className="game-play__input-placeholder"
          name="guess-input"
          type="text"
          placeholder="Write your guess..."
          ref={inputRef}
          maxLength={wordLength}
        ></input>
        <button className="game-play__input-btn" onClick={handleGuess}>
          GUESS
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default GamePlay
