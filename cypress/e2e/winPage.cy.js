it('should show the win page when the game is won', () => {
  cy.intercept('GET', '/api/words/lengths?lang=en', {
    statusCode: 200,
    body: [3, 4, 5, 6, 7],
  }).as('getWordLengths')

  cy.intercept('POST', '/api/games/guesses', {
    statusCode: 200,
    body: {
      letterFeedback: [
        { letter: 'h', result: 'correct' },
        { letter: 'e', result: 'correct' },
        { letter: 'y', result: 'correct' },
      ],
      gameWon: true,
      timeTaken: '00:05',
    },
  }).as('validateGuess')

  cy.visit('/')
  cy.wait('@getWordLengths')

  cy.get('[data-cy=word-length-select]').select('3')
  cy.get('.game-setup__button').click()

  cy.get('.game-play__input-placeholder').type('hey')
  cy.get('.game-play__input-btn').click()
  cy.wait('@validateGuess')

  cy.get('.win-page').should('exist')
  cy.get('.win-page__guess-count').should('contain', '1')
})
