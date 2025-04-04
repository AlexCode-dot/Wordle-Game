function EndGameButton({ endGame }) {
  return (
    <>
      <button className="game-play__give-up-btn" onClick={endGame}>
        Give up
      </button>
    </>
  )
}

export default EndGameButton
