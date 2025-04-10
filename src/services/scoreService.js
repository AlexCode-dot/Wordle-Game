export function calculateTimeTaken(startTime, endTime) {
  const timeTakenMs = endTime - startTime
  const minutes = Math.floor(timeTakenMs / 60000)
  const seconds = Math.floor((timeTakenMs % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function createScore(api, name, guessCount, correctWord, startTime, endTime, formattedTime, rules) {
  return new api.HighScore({
    name,
    guessCount,
    correctWord,
    startTime,
    endTime,
    timeTaken: formattedTime,
    rules,
  })
}
