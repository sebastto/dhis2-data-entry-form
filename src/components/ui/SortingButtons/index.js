import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

import './index.css'

const SortingButtons = props => {
    const { labelOne, labelTwo, onClick } = props

    const [firstUp, setFirstUp] = useState(true)
    const [secondUp, setSecondUp] = useState(true)

    const handleFirstOption = () => {
        setFirstUp(!firstUp)
        onClick(firstUp, secondUp)
    }

    const handleSecondOption = () => {
        setSecondUp(!secondUp)
        onClick(firstUp, secondUp)
    }

    return (
        <div className="sortingbuttons-container">
            <button className="first-option" onClick={handleFirstOption}>
                {labelOne}
                {firstUp ? <FaCaretUp /> : <FaCaretDown />}
            </button>
            <button className="second-option" onClick={handleSecondOption}>
                {labelTwo}
                {secondUp ? <FaCaretUp /> : <FaCaretDown />}
            </button>
        </div>
    )
}

SortingButtons.propTypes = {
    labelOne: PropTypes.string.isRequired,
    labelTwo: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default SortingButtons
