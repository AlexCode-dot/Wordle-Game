import RenderGuessWordsFeedback from './GuessWordsFeedback.jsx'
import { useGameWon } from '../hooks/useGameWon.js'

function GameWon({ winningGuess, wordLength, guessCount, gameTime }) {
  const { name, handleNameChange, handlePostScore } = useGameWon()

  return (
    <div className="win-page">
      <h2 className="win-page__title">You won!</h2>
      <div className="win-page__word-container">
        <RenderGuessWordsFeedback guessWordsFeedback={winningGuess} wordLength={wordLength} />
      </div>
      <p className="win-page__guess-count">Guess count: {guessCount}</p>
      <p className="win-page__timer">Time: {gameTime}</p>
      <label className="win-page__input-label" htmlFor="name-input">
        Enter your name
      </label>
      <input
        className="win-page__input-placeholder"
        name="name-input"
        type="text"
        placeholder="Write your name..."
        value={name}
        onChange={handleNameChange}
      />
      <div className="win-page__btn-container">
        <button className="win-page__btn-restart" onClick={() => window.location.reload()}>
          Restart game
        </button>
        <button className="win-page__btn-leaderboard" onClick={handlePostScore}>
          Add to leaderboard
        </button>
      </div>
    </div>
  )
}

export default GameWon
