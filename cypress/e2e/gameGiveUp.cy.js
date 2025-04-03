describe('User gives up (Lose State)', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.game-setup__dropdown-select').select('4')
    cy.get('.game-setup__button').click()
  })

  it('should show the correct word when user gives up', () => {
    cy.intercept('GET', '/api/games/correct-word', {
      statusCode: 200,
      body: '"test"',
      headers: { 'Content-Type': 'application/json' },
    }).as('getCorrectWord')

    cy.get('.game-play__give-up-btn').click()

    cy.wait('@getCorrectWord')

    cy.get('.game-lose__title').should('contain', 'You lost!')
    cy.get('.game-lose__sub-title').should('contain', 'The correct word was:')
    cy.get('.game-lose__correct-word').should('contain', 'TEST')
  })
})
