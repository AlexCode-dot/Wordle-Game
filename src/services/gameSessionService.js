export function startNewGame(req, gameStatus, gameSettings) {
    req.session.game = {
      correctWord: gameStatus.correctWord,
      startTime: Date.now(),
      rules: gameSettings,
      guesses: [],
      state: 'playing',
    }
  }
  
  export function saveGuess(req, feedback) {
    req.session.game.guesses.push(feedback)
    const allCorrect = feedback.every((letter) => letter.result === 'correct')
    if (allCorrect) {
      req.session.game.state = 'win'
      req.session.game.winningFeedback = feedback
    }
  
    req.session.save((err) => {
      if (err) {
        console.error('Failed to save session:', err)
        return
      }
    })
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
  