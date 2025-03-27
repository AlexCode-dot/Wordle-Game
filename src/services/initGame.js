import getWord from './wordSelector.js'

export default async function initGame(api, wordLength, noLetterDuplicate) {
  const wordList = await api.loadWords()
  const correctWord = getWord(wordList, wordLength, noLetterDuplicate)

  if (correctWord === 'No matching word found.') {
    return { message: correctWord, gameStarted: false }
  } else {
    console.log(correctWord)
    return { wordLength: correctWord.length, gameStarted: true }
  }
}
