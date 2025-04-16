export default function getWord(wordsList: string[], wordLength: number, noLetterDuplicate: boolean): string {
  if (wordsList.length === 0) return 'No matching word found.'

  const filteredWords = wordsList
    .map((word) => word.replace(/\W/g, '').toLowerCase())
    .filter((word) => {
      const isCorrectLength = word.length === wordLength
      const hasUniqueLetters = new Set(word).size === word.length
      return isCorrectLength && (!noLetterDuplicate || hasUniqueLetters)
    })

  if (filteredWords.length === 0) return 'No matching word found.'

  const randomIndex = Math.floor(Math.random() * filteredWords.length)
  return filteredWords[randomIndex]
}
