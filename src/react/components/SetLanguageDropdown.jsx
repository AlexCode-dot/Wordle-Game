function SetLanguageDropdown({ language, setLanguage }) {
  return (
    <label className="game-setup__dropdown-label">
      Choose word language:
      <select
        name="language"
        className="game-setup__dropdown-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="sv">Swedish</option>
      </select>
    </label>
  )
}

export default SetLanguageDropdown
