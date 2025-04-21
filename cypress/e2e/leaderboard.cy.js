describe('Leaderboard filtering - no results', () => {
  it('shows a message when no scores match the filters', () => {
    cy.intercept('GET', '/api/words/lengths?lang=en', {
      statusCode: 200,
      body: [4, 5],
    }).as('getLengths')

    cy.intercept('GET', '/leaderboard?length=4&unique=true', (req) => {
      req.reply(`
          <html>
            <h1 class="leaderboard__title">Leaderboard</h1>
            <p class="leaderboard__empty">No scores found</p>
          </html>
        `)
    }).as('getFilteredEmpty')

    cy.visit('/leaderboard?length=4&unique=true')
    cy.wait('@getFilteredEmpty')

    cy.get('.leaderboard__title').should('contain', 'Leaderboard')
    cy.get('.leaderboard__empty').should('contain', 'No scores found')
  })
})

describe('Score submission failure', () => {
  it('shows an error if submitting score fails', () => {
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
    }).as('win')

    cy.intercept('POST', '/api/submit-score', {
      statusCode: 500,
      body: { error: 'Database failed' },
    }).as('submitFail')

    cy.visit('/')
    cy.get('[data-cy=word-length-select]').select('3')
    cy.get('.game-setup__button').click()

    cy.get('.game-play__input-placeholder').type('hey')
    cy.get('.game-play__input-btn').click()
    cy.wait('@win')

    cy.get('.win-page__input-placeholder').type('FailUser')
    cy.get('.win-page__btn-leaderboard').click()
    cy.wait('@submitFail')

    cy.get('.error-message').should('contain', 'Failed to post score')
  })
})
