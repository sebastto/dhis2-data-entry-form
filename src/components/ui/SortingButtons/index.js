import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

import './index.css'

const SortingButtons = props => {
    const { labelOne, labelTwo, defaultCaret, onClick } = props

    /* Carets by default are with pointy  side down (i.e., sorting chronologically) */
    const [firstCaretUp, setFirstCaret] = useState(
        defaultCaret === 1 ? false : null
    )
    const [secondCaretUp, setSecondCaret] = useState(
        defaultCaret === 2 ? false : null
    )

    const handleFirstOption = () => {
        setFirstCaret(!firstCaretUp)
        setSecondCaret(null)

        onClick(firstCaretUp, secondCaretUp)
    }

    const handleSecondOption = () => {
        setSecondCaret(!secondCaretUp)
        setFirstCaret(null)

        onClick(firstCaretUp, secondCaretUp)
    }

    return (
        <div className="sortingbuttons-container">
            <button
                className={'first-option ' + firstCaretUp}
                onClick={handleFirstOption}
            >
                {labelOne}
                {/* If null, don't show caret at all. Will always show CaretDown on hover, do we care about this? */}
                {firstCaretUp ? <FaCaretUp /> : <FaCaretDown />}
            </button>
            <button
                className={'second-option ' + secondCaretUp}
                onClick={handleSecondOption}
            >
                {labelTwo}
                {secondCaretUp ? <FaCaretUp /> : <FaCaretDown />}
            </button>
        </div>
    )
}

SortingButtons.propTypes = {
    labelOne: PropTypes.string.isRequired,
    labelTwo: PropTypes.string.isRequired,
    defaultCaret: PropTypes.number,
    onClick: PropTypes.func.isRequired,
}

SortingButtons.defaultProps = {
    defaultCaret: null,
}

export default SortingButtons
