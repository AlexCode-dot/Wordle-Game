import { API, GameRules, InitGameResult, WordSource } from '../types'
import getWord from './wordSelector'

async function processWord(wordList: string[], gameSettings: GameRules): Promise<string> {
  const { wordLength, noLetterDuplicate, language } = gameSettings
  return getWord(wordList, wordLength, noLetterDuplicate, language)
}

export default async function initGame(api: API, gameSettings: GameRules): Promise<InitGameResult> {
  const wordList = await api.loadWords(process.env.WORD_SOURCE as WordSource, gameSettings.language)
  const correctWord = await processWord(wordList, gameSettings)

  if (correctWord === 'No matching word found.') {
    return {
      message: correctWord,
      gameStarted: false,
    }
  }

  console.log(correctWord)
  return {
    wordLength: correctWord.length,
    gameStarted: true,
    correctWord,
  }
}
