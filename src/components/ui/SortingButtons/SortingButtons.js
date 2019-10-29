import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

import './SortingButtons.css'

const SortingButtons = props => {
    const { firstOption, secondOption, onClick } = props

    /* Carets by default are with pointy  side down (i.e., sorting chronologically) */
    const [firstCaretUp, setFirstCaret] = useState(
        firstOption.default ? false : null
    )
    const [secondCaretUp, setSecondCaret] = useState(
        secondOption.default ? false : null
    )

    const handleFirstOption = () => {
        setFirstCaret(!firstCaretUp)
        setSecondCaret(null)
    }

    const handleSecondOption = () => {
        setSecondCaret(!secondCaretUp)
        setFirstCaret(null)
    }

    useEffect(() => {
        /* Runs on componentDidMount aswell, to handle default caret cases */
        if (firstCaretUp !== null) {
            onClick({
                order: firstCaretUp ? 'asc' : 'desc',
                key: firstOption.key,
            })
        } else if (secondCaretUp !== null) {
            onClick({
                order: secondCaretUp ? 'asc' : 'desc',
                key: secondOption.key,
            })
        }
    }, [firstCaretUp, secondCaretUp])

    return (
        <div className="sortingbuttons-container">
            <button
                className={'first-option ' + firstCaretUp}
                onClick={handleFirstOption}
            >
                {firstOption.title}
                {/* If null, don't show caret at all. Will always show CaretDown on hover, do we care about this? */}
                {firstCaretUp ? <FaCaretUp /> : <FaCaretDown />}
            </button>
            <button
                className={'second-option ' + secondCaretUp}
                onClick={handleSecondOption}
            >
                {secondOption.title}
                {secondCaretUp ? <FaCaretUp /> : <FaCaretDown />}
            </button>
        </div>
    )
}

const optionShape = {
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    default: PropTypes.bool,
}

SortingButtons.propTypes = {
    firstOption: PropTypes.shape(optionShape).isRequired,
    secondOption: PropTypes.shape(optionShape).isRequired,
    onClick: PropTypes.func.isRequired,
}

SortingButtons.defaultProps = {
    firstOption: PropTypes.shape({
        default: false,
    }),
    secondOption: PropTypes.shape({
        default: false,
    }),
}

export default SortingButtons
