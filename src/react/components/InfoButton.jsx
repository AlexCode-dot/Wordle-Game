import React, { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'
import InfoModal from './InfoModal.jsx'

function InfoButton({ wordLength }) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <button className="info-button" onClick={() => setShowInfo(true)}>
        <FaInfoCircle size={40} />
      </button>
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} wordLength={wordLength} />}
    </>
  )
}

export default InfoButton
