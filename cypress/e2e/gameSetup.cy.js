describe('Game Setup and Start', () => {
  it('should load in the setup state', () => {
    cy.visit('/')
    cy.get('.game-setup').should('exist')
  })

  it('should load in the setup state with a mocked word length dropdown', () => {
    cy.intercept('GET', '/api/words/lengths', {
      statusCode: 200,
      body: [3, 4, 5, 6, 7],
    }).as('getWordLengths')

    cy.visit('/')

    cy.wait('@getWordLengths')

    cy.get('.game-setup__dropdown-select').should('be.visible').find('option').should('have.length', 6)

    cy.get('.game-setup__dropdown-select')
      .children('option')
      .first()
      .should('have.value', '')
      .should('contain.text', 'Select length')

    cy.get('.game-setup__dropdown-select').children('option').last().should('have.value', '7')
  })

  it('should allow the user to select a word length and start the game', () => {
    cy.intercept('GET', '/api/words/lengths', {
      statusCode: 200,
      body: [3, 4, 5, 6, 7],
    }).as('getWordLengths')

    cy.visit('/')
    cy.wait('@getWordLengths')

    cy.get('.game-setup__dropdown-select').select('5')
    cy.get('.game-setup__button').click()

    cy.get('.game-play').should('exist')
  })
})
