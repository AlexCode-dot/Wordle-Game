import getWord from './wordSelector.js'

async function processWord(wordList, gameSettings) {
  const { wordLength, noLetterDuplicate } = gameSettings
  const correctWord = getWord(wordList, wordLength, noLetterDuplicate)
  return correctWord
}

export default async function initGame(api, gameSettings) {
  const wordList = await api.loadWords()

  const correctWord = await processWord(wordList, gameSettings)

  if (correctWord === 'No matching word found.') {
    return { message: correctWord, gameStarted: false }
  } else {
    console.log(correctWord)
    return { wordLength: correctWord.length, gameStarted: true, correctWord }
  }
}
