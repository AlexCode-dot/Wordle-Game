function RenderGuessWordsFeedback({ guessWordsFeedback, wordLength }) {
  console.log('All Words:', guessWordsFeedback)

  return (
    <div className="guess-row__wrapper">
      {guessWordsFeedback.map((word, index) => (
        <ul key={index} className="guess-row">
          {console.log('One Word:', word)}
          {word.map((letterObj, i) => {
            let className = 'guess-row__letter-box'

            if (letterObj.result === 'correct') className += ' guess-correct'
            else if (letterObj.result === 'incorrect') className += ' guess-incorrect'
            else if (letterObj.result === 'misplaced') className += ' guess-misplaced'

            return (
              <li key={i} className={className}>
                {letterObj.letter.toUpperCase()}
              </li>
            )
          })}
        </ul>
      ))}

      {guessWordsFeedback.length === 0 && (
        <ul className="guess-row">
          {Array.from({ length: wordLength }).map((_, i) => (
            <li key={i} className="guess-row__letter-box"></li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RenderGuessWordsFeedback
