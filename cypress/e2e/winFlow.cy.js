describe('Full game win flow', () => {
  it('lets the user win and view the mocked leaderboard', () => {
    // Intercept word lengths
    cy.intercept('GET', '/api/words/lengths', {
      statusCode: 200,
      body: [3, 5, 6],
    }).as('getWordLengths')

    // Intercept starting the game
    cy.intercept('POST', '/api/games', {
      statusCode: 201,
      body: {
        gameStarted: true,
        wordLength: 3,
      },
    }).as('startGame')

    // Intercept correct guess (simulate win)
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

    // Intercept score submission
    cy.intercept('POST', '/api/submit-score', {
      statusCode: 200,
      body: { success: true },
    }).as('submitScore')

    // Intercept leaderboard fetch
    cy.intercept('GET', '/leaderboard', (req) => {
      req.reply((res) => {
        res.send(`
            <html>
              <h1 class="leaderboard__title">Leaderboard</h1>
            </html>
          `)
      })
    }).as('getLeaderboard')

    cy.visit('/')
    cy.wait('@getWordLengths')

    cy.get('.game-setup__dropdown-select').select('3')
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

    cy.wait('@getLeaderboard')
    cy.get('.leaderboard__title').should('contain', 'Leaderboard')
  })
})
