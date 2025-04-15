'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = getWord
function getWord(wordsList, wordLength, noLetterDuplicate) {
  if (wordsList.length > 0) {
    const filteredWords = wordsList
      .map((word) => word.replace(/\W/g, '').toLowerCase())
      .filter((word) => word.length === wordLength && (!noLetterDuplicate || new Set(word).size === word.length))
    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length)
      return filteredWords[randomIndex]
    }
  }
  return 'No matching word found.'
}
