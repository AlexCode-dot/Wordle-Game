function SetLanguageDropdown({ language, setLanguage }) {
  return (
    <div>
      <label className="game-setup__dropdown-label">Choose word language:</label>
      <select
        name="language"
        className="game-setup__dropdown-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="sv">Swedish</option>
      </select>
    </div>
  )
}

export default SetLanguageDropdown
