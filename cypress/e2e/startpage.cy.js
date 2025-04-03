describe('Startpage Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Side loaded correcly', () => {
    cy.get('h1').should('be.visible').contains('WORDLE')
  })
})
