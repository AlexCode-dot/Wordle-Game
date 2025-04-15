import { API, GameRules } from '../types'
import getWord from './wordSelector'

async function processWord(wordList: string[], gameSettings: GameRules): Promise<string> {
  const { wordLength, noLetterDuplicate } = gameSettings
  const correctWord = getWord(wordList, wordLength, noLetterDuplicate)
  return correctWord
}

export default async function initGame(
  api: API,
  gameSettings: GameRules
): Promise<{ wordLength?: number; gameStarted: boolean; correctWord?: string; message?: string }> {
  const wordList = await api.loadWords()

  const correctWord = await processWord(wordList, gameSettings)

  if (correctWord === 'No matching word found.') {
    return { message: correctWord, gameStarted: false }
  } else {
    console.log(correctWord)
    return { wordLength: correctWord.length, gameStarted: true, correctWord }
  }
}
