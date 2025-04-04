import React from 'react'
import WordLengthDropdown from './WordLengthDropdown'
import { useGameSetup } from '../hooks/useGameSetup.js'

function GameSetup({ onStart }) {
  const {
    wordLengths,
    fetchError,
    error,
    selectedLength,
    setSelectedLength,
    noDuplicates,
    setNoDuplicates,
    handleStart,
  } = useGameSetup(onStart)

  return (
    <div className="game-setup">
      <h2 className="game-setup__title">Choose game settings</h2>
      {fetchError && <p className="error-message">{fetchError}</p>}
      <WordLengthDropdown lengths={wordLengths} selectedLength={selectedLength} onLengthChange={setSelectedLength} />
      <div className="game-setup__checkbox-container">
        <input
          className="game-setup__checkbox-value"
          type="checkbox"
          name="checkbox"
          checked={noDuplicates}
          onChange={(e) => setNoDuplicates(e.target.checked)}
        />
        <label className="game-setup__checkbox-label" htmlFor="checkbox">
          No duplicated letters
        </label>
      </div>
      <button className="game-setup__button" onClick={handleStart}>
        START
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default GameSetup
