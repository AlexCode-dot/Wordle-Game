import React, { useState, useEffect } from 'react'
import WordLengthDropdown from './WordLengthDropdown'
import { useWordLengths } from '../API/FetchWordLengths'

function GameSetup({ onStart }) {
  const [error, setError] = useState(null)
  const { wordLengths, error: fetchError } = useWordLengths()
  const [noDuplicates, setNoDuplicates] = useState(false)
  const [selectedLength, setSelectedLength] = useState('')

  async function handleStart() {
    setError(null)

    if (!selectedLength) {
      setError('Please select a word length.')
      return
    }

    const rules = {
      wordLength: Number(selectedLength),
      noLetterDuplicate: noDuplicates,
    }

    const result = await onStart(rules)
    if (result.success && !result.data.gameStarted) {
      setError(result.data.message)
    }

    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <div className="game-setup">
      <h2 className="game-setup__title">Choose game settings</h2>
      {fetchError && <p className="error-message">{fetchError}</p>} {}
      <WordLengthDropdown lengths={wordLengths} selectedLength={selectedLength} onLengthChange={setSelectedLength} />
      <div className="game-setup__checkbox-container">
        <input
          className="game-setup__checkbox-value"
          type="checkbox"
          name="checkbox"
          checked={noDuplicates}
          onChange={(e) => setNoDuplicates(e.target.checked)}
        />
        <label className="game-setup__checkbox-label" for="checkbox">
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
