describe('Full game win flow', () => {
  it('lets the user win and view the mocked leaderboard', () => {
    // Mock word lengths for EN
    cy.intercept('GET', '/api/words/lengths?lang=en', {
      statusCode: 200,
      body: [3, 5, 6],
    }).as('getWordLengths')

    // Mock starting the game
    cy.intercept('POST', '/api/games', {
      statusCode: 201,
      body: {
        gameStarted: true,
        wordLength: 3,
        language: 'en',
      },
    }).as('startGame')

    // Mock correct guess (win)
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
    }).as('guessCorrect')

    // Mock score submission
    cy.intercept('POST', '/api/submit-score', {
      statusCode: 200,
      body: { success: true },
    }).as('submitScore')

    // Mock leaderboard page
    cy.intercept('GET', '/leaderboard').as('getLeaderboard')

    // Start test
    cy.visit('/')
    cy.wait('@getWordLengths')

    cy.get('[data-cy=word-length-select]').select('3')
    cy.get('.game-setup__button').click()
    cy.wait('@startGame')

    cy.get('.game-play__input-placeholder').type('hey')
    cy.get('.game-play__input-btn').click()
    cy.wait('@guessCorrect')

    cy.get('.win-page').should('exist')
    cy.get('.win-page__guess-count').should('contain', '1')

    cy.get('.win-page__input-placeholder').type('TestUser')
    cy.get('.win-page__btn-leaderboard').click()
    cy.wait('@submitScore')

    cy.url().should('include', '/leaderboard')
    cy.wait('@getLeaderboard')
    cy.get('.leaderboard__title').should('contain', 'Leaderboard')
  })
})
