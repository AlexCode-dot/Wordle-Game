describe('Win state persists after reload', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/words/lengths?lang=en', {
      statusCode: 200,
      body: [3],
    }).as('getWordLengths')

    cy.intercept('GET', '/api/games/status', {
      statusCode: 200,
      body: {
        gameStarted: true,
        state: 'win',
        guesses: ['hey'],
        winningFeedback: [
          { letter: 'h', result: 'correct' },
          { letter: 'e', result: 'correct' },
          { letter: 'y', result: 'correct' },
        ],
        timeTaken: '00:05',
        rules: {
          wordLength: 3,
          noLetterDuplicate: true,
          language: 'en',
        },
      },
    }).as('gameStatus')
  })

  it('shows the win screen after reload', () => {
    cy.visit('/')
    cy.wait('@getWordLengths')
    cy.wait('@gameStatus')

    cy.get('.win-page').should('exist')
    cy.get('.win-page__guess-count').should('contain', '1')
    cy.get('.guess-row__letter-box').each((box) => {
      cy.wrap(box).should('have.class', 'guess-correct')
    })
  })
})

describe('Playing state persists after reload', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/words/lengths?lang=en', {
      statusCode: 200,
      body: [4],
    }).as('getWordLengths')

    cy.intercept('GET', '/api/games/status', {
      statusCode: 200,
      body: {
        gameStarted: true,
        state: 'playing',
        rules: {
          wordLength: 4,
          noLetterDuplicate: false,
          language: 'en',
        },
        guesses: [
          [
            { letter: 's', result: 'misplaced' },
            { letter: 'd', result: 'incorrect' },
            { letter: 'a', result: 'misplaced' },
            { letter: 'd', result: 'incorrect' },
          ],
          [
            { letter: 'd', result: 'incorrect' },
            { letter: 'a', result: 'correct' },
            { letter: 's', result: 'correct' },
            { letter: 'd', result: 'incorrect' },
          ],
          [
            { letter: 'd', result: 'incorrect' },
            { letter: 's', result: 'misplaced' },
            { letter: 'a', result: 'misplaced' },
            { letter: 'd', result: 'incorrect' },
          ],
        ],
        winningFeedback: null,
      },
    }).as('gameStatus')
  })

  it('restores game play screen and guess history after reload', () => {
    cy.visit('/')
    cy.wait('@getWordLengths')
    cy.wait('@gameStatus')

    cy.get('.game-play').should('exist')
    cy.get('.guess-row').should('have.length', 3)

    cy.get('.guess-row')
      .eq(0)
      .within(() => {
        cy.get('.guess-row__letter-box').eq(0).should('contain', 'S').and('have.class', 'guess-misplaced')
        cy.get('.guess-row__letter-box').eq(1).should('contain', 'D').and('have.class', 'guess-incorrect')
      })

    cy.get('.guess-row')
      .eq(1)
      .within(() => {
        cy.get('.guess-row__letter-box').eq(1).should('contain', 'A').and('have.class', 'guess-correct')
        cy.get('.guess-row__letter-box').eq(2).should('contain', 'S').and('have.class', 'guess-correct')
      })
  })
})
