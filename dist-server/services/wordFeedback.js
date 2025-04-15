'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = generateWordFeedback
function generateWordFeedback(guessWord, correctWord) {
  const guessArray = guessWord.replace(/\W/g, '').toLowerCase().split('')
  const correctArray = correctWord.replace(/\W/g, '').toLowerCase().split('')
  if (guessArray.length === correctArray.length) {
    const guessFeedback = guessArray.map((item) => ({
      letter: item,
      result: '',
    }))
    const letterFrequency = correctArray.reduce((count, letter) => {
      count[letter] = (count[letter] || 0) + 1
      return count
    }, {})
    guessFeedback.forEach((item, index) => {
      if (item.letter === correctArray[index]) {
        item.result = 'correct'
        letterFrequency[item.letter] -= 1
      }
    })
    guessFeedback.forEach((item) => {
      if (item.result === '') {
        if (letterFrequency[item.letter] > 0) {
          item.result = 'misplaced'
          letterFrequency[item.letter] -= 1
        } else {
          item.result = 'incorrect'
        }
      }
    })
    return guessFeedback
  }
  return false
}
