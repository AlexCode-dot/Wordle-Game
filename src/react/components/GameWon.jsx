import RenderGuessWordsFeedback from './GuessWordsFeedback.jsx'

function GameWon({ winningGuess, wordLength }) {
  return (
    <div className="win-page">
      <h2 className="win-page__title">You won!</h2>
      <div className="win-page__word-container">
        <RenderGuessWordsFeedback guessWordsFeedback={winningGuess} wordLength={wordLength} />
      </div>
      <p className="win-page__guess-count">Guess count:</p>
      <p className="win-page__timer">Time:</p>
      <label className="win-page__input-label" htmlFor="name-input">
        Enter your name
      </label>
      <input
        className="win-page__input-placeholder"
        name="name-input"
        type="text"
        placeholder="Write your name..."
      ></input>
      <div className="win-page__btn-container">
        <button className="win-page__btn-restart" onClick={() => window.location.reload()}>
          Restart game
        </button>
        <button className="win-page__btn-leaderboard">Add to leaderboard</button>
      </div>
    </div>
  )
}

export default GameWon
