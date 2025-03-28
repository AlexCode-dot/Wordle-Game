import { useState } from 'react'

function GameSetup({ onStart }) {
  const [error, setError] = useState(null)
  const [wordLength, setWordLength] = useState('') // Stores dropdown selection
  const [noDuplicates, setNoDuplicates] = useState(false) // Stores checkbox state

  async function handleStart() {
    setError(null)

    if (!wordLength) {
      setError('Please select a word length.')
      return
    }

    const rules = {
      wordLength: Number(wordLength), // Convert to number
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
      <label className="game-setup__dropdown-label" htmlFor="dropdown">
        Choose word size:
      </label>
      <select
        className="game-setup__dropdown-select"
        id="dropdown"
        name="dropdown"
        value={wordLength}
        onChange={(e) => setWordLength(e.target.value)}
      >
        <option className="game-setup__dropdown-item" value="">
          Select length
        </option>
        <option className="game-setup__dropdown-item" value="1">
          1
        </option>
        <option className="game-setup__dropdown-item" value="2">
          2
        </option>
        <option className="game-setup__dropdown-item" value="3">
          3
        </option>
        <option className="game-setup__dropdown-item" value="45">
          45
        </option>
      </select>
      <div className="game-setup__checkbox-container">
        <input
          className="game-setup__checkbox-value"
          type="checkbox"
          id="checkbox"
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
