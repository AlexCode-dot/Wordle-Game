import React from 'react'

function WordLengthDropdown({ lengths, selectedLength, onLengthChange }) {
  return (
    <div>
      <label className="game-setup__dropdown-label" htmlFor="wordLength">
        Choose word length:
      </label>
      <select
        className="game-setup__dropdown-select"
        id="wordLength"
        data-cy="word-length-select"
        value={selectedLength}
        onChange={(e) => onLengthChange(e.target.value)}
      >
        <option className="game-setup__dropdown-item" value="">
          Select length
        </option>
        {lengths.map((length) => (
          <option className="game-setup__dropdown-item" key={length} value={length}>
            {length}
          </option>
        ))}
      </select>
    </div>
  )
}

export default WordLengthDropdown
