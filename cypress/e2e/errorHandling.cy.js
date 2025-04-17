describe('Game setup validation', () => {
  it('should show error if user tries to start without selecting word length', () => {
    cy.visit('/')

    cy.get('.game-setup__dropdown-select').should('exist')

    cy.get('.game-setup__button').click()

    cy.url().should('include', '/')

    cy.get('.error-message').should('be.visible').and('contain', 'Please select a word length')
  })
})

describe('Guess length validation', () => {
  it('shows error if guess is shorter than required length', () => {
    cy.visit('/')
    cy.get('.game-setup__dropdown-select').select('5')
    cy.get('.game-setup__button').click()
    cy.get('.game-play__input-placeholder').type('ab')
    cy.get('.game-play__input-btn').click()

    cy.get('.error-message').should('be.visible').and('contain', 'Your guess must match the word length.')
  })
})

it('shows error if backend responds with 500', () => {
  cy.intercept('POST', '/api/games/guesses', {
    statusCode: 500,
    body: { error: 'Something went wrong' },
  }).as('failGuess')

  cy.visit('/')
  cy.get('.game-setup__dropdown-select').select('5')
  cy.get('.game-setup__button').click()

  cy.get('.game-play__input-placeholder').type('apple')
  cy.get('.game-play__input-btn').click()

  cy.wait('@failGuess')

  cy.get('.error-message').should('be.visible').and('contain', 'Something went wrong')
})

describe('Win page name input validation', () => {
  beforeEach(() => {
    cy.visit('/')

    cy.get('.game-setup__dropdown-select').select('3')
    cy.get('.game-setup__button').click()

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
    }).as('guess')

    cy.get('.game-play__input-placeholder').type('hey')
    cy.get('.game-play__input-btn').click()
    cy.wait('@guess')
  })

  it('blocks empty name', () => {
    cy.get('.win-page__btn-leaderboard').click()
    cy.get('.error-message').should('contain', 'Name is required')
  })

  it('blocks special characters', () => {
    cy.get('.win-page__input-placeholder').type('!!@@##')
    cy.get('.win-page__btn-leaderboard').click()
    cy.get('.error-message').should('contain', 'Name must contain only letters and numbers.')
  })

  it('allows valid name and redirects', () => {
    cy.intercept('POST', '/api/submit-score', {
      statusCode: 200,
      body: { success: true },
    }).as('submitScore')

    cy.get('.win-page__input-placeholder').type('ValidName')
    cy.get('.win-page__btn-leaderboard').click()
    cy.wait('@submitScore')

    cy.url().should('include', '/leaderboard')
  })
})
