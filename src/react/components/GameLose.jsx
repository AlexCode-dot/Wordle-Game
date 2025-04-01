function GameLose({ correctWord }) {
  return (
    <div className="game-lose">
      <h2 className="game-lose__title">You lost!</h2>
      <h3 className="game-lose__sub-title">The correct word was:</h3>
      <p className="game-lose__correct-word">{correctWord.toUpperCase()}</p>
      <button className="game-lose__restart-btn" onClick={() => window.location.reload()}>
        Play Again
      </button>
    </div>
  )
}

export default GameLose
