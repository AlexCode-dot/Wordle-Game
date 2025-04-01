function GuessInput({ inputRef, wordLength, onGuess }) {
  return (
    <>
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
        />
        <button className="game-play__input-btn" onClick={onGuess}>
          GUESS
        </button>
      </div>
    </>
  )
}

export default GuessInput
