export function startNewGame(req, gameStatus, gameSettings) {
  req.session.game = {
    correctWord: gameStatus.correctWord,
    startTime: Date.now(),
    rules: gameSettings,
    guesses: [],
    state: 'playing',
  }
}

export function saveGuess(req, feedback, gameWon) {
  const game = req.session.game

  game.guesses.push(feedback)

  if (gameWon) {
    game.state = 'win'
    game.winningFeedback = feedback
  }
}

export function retrieveSessionGameStatus(req) {
  return req.session.game || null
}

export function destroySession(req) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err)
      throw new Error('Failed to destroy session.')
    }
  })
}
