'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.startNewGame = startNewGame
exports.saveGuess = saveGuess
exports.retrieveSessionGameStatus = retrieveSessionGameStatus
exports.destroySession = destroySession
function startNewGame(req, gameStatus, gameSettings) {
  req.session.game = {
    correctWord: gameStatus.correctWord,
    startTime: Date.now(),
    rules: gameSettings,
    guesses: [],
    state: 'playing',
  }
}
function saveGuess(req, feedback, gameWon, timeTaken) {
  const game = req.session.game
  game.guesses.push(feedback)
  if (gameWon) {
    game.state = 'win'
    game.winningFeedback = feedback
    game.timeTaken = timeTaken
  }
}
function retrieveSessionGameStatus(req) {
  return req.session.game ?? null
}
function destroySession(req) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err)
      throw new Error('Failed to destroy session.')
    }
  })
}
