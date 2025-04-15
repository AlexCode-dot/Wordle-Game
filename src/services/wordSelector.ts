export default function getWord(wordsList: string[], wordLength: number, noLetterDuplicate: boolean): string {
  if (wordsList.length > 0) {
    const filteredWords = wordsList
      .map((word: string) => word.replace(/\W/g, '').toLowerCase())
      .filter(
        (word: string) => word.length === wordLength && (!noLetterDuplicate || new Set(word).size === word.length)
      )

    if (filteredWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length)
      return filteredWords[randomIndex]
    }
  }

  return 'No matching word found.'
}
