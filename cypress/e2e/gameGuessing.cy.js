describe('Guess Feedback Colors', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=word-length-select]').select('3')
    cy.get('.game-setup__button').click()
  })

  it('should display correct feedback colors for guessed word', () => {
    cy.intercept('POST', '/api/games/guesses', {
      statusCode: 200,
      body: {
        letterFeedback: [
          { letter: 'h', result: 'correct' },
          { letter: 'e', result: 'misplaced' },
          { letter: 'y', result: 'incorrect' },
        ],
        gameWon: false,
      },
    }).as('postGuess')

    cy.get('.game-play__input-placeholder').type('hey')
    cy.get('.game-play__input-btn').click()
    cy.wait('@postGuess')

    cy.get('.guess-row').should('exist')
    cy.get('.guess-row')
      .eq(0)
      .within(() => {
        cy.get('.guess-row__letter-box').eq(0).should('contain', 'H').should('have.class', 'guess-correct')
        cy.get('.guess-row__letter-box').eq(1).should('contain', 'E').should('have.class', 'guess-misplaced')
        cy.get('.guess-row__letter-box').eq(2).should('contain', 'Y').should('have.class', 'guess-incorrect')
      })
  })
})
