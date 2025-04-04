import React from 'react'

function InfoModal({ onClose, wordLength }) {
  return (
    <>
      <div className="info-modal-backdrop" onClick={onClose}></div>
      <div className="info-modal">
        <div className="info-modal__content">
          <h3 className="info-modal__title">Game Info</h3>
          <p>Try to guess the hidden word. Your guess should have {wordLength} letters.</p>
          <h4 className="info-modal__sub-title">Letter feedback explanation:</h4>
          <div className="info-modal__feedback">
            <div className="feedback-box guess-misplaced"></div>
            <span>
              A yellow square means the letter is misplaced (the correct word contains the letter but it's not in the
              same index as the guess).
            </span>
          </div>
          <div className="info-modal__feedback">
            <div className="feedback-box guess-incorrect"></div>
            <span>A red square means the correct word does not contain this letter.</span>
          </div>
          <div className="info-modal__feedback">
            <div className="feedback-box guess-correct"></div>
            <span>A green square means the letter matches and is in the correct position.</span>
          </div>
          <button className="info-modal__close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default InfoModal
