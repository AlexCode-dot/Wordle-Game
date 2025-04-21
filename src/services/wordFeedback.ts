import { LetterFeedback, WordLanguage } from '../types'
import { getLetterSanitizer } from '../lib/letterSanitizer'

export default function generateWordFeedback(
  guessWord: string,
  correctWord: string,
  language: WordLanguage
): LetterFeedback[] | false {
  const sanitize = getLetterSanitizer(language)

  const guessArray = guessWord.replace(sanitize, '').toLowerCase().split('')
  const correctArray = correctWord.replace(sanitize, '').toLowerCase().split('')

  if (guessArray.length !== correctArray.length) return false

  const guessFeedback: LetterFeedback[] = guessArray.map((letter) => ({
    letter,
    result: '',
  }))

  const letterFrequency = correctArray.reduce((count: Record<string, number>, letter) => {
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
