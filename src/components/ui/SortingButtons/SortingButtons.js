import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

import './SortingButtons.css'
import Sorting from '../../../utils/Sorting'

const SortingButtons = props => {
    const { firstOption, secondOption } = props

    /* Carets by default are with pointy  side down for names, opposite for dates*/
    const [firstCaretUp, setFirstCaret] = useState(
        firstOption.default ? false : null
    )
    const [secondCaretUp, setSecondCaret] = useState(
        secondOption.default ? true : null
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
        const { onClick, objectToSet, prevObject, sortingFunc } = props
        /* Runs on componentDidMount aswell, to handle default caret cases */
        if (onClick && objectToSet && prevObject && sortingFunc) {
            if (firstCaretUp !== null) {
                onClick(
                    {
                        order: firstCaretUp ? 'asc' : 'desc',
                        key: firstOption.key,
                    },
                    { objectToSet, prevObject },
                    sortingFunc
                )
            } else if (secondCaretUp !== null) {
                onClick(
                    {
                        order: secondCaretUp ? 'asc' : 'desc',
                        key: secondOption.key,
                    },
                    { objectToSet, prevObject },
                    sortingFunc
                )
            }
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
    objectToSet: PropTypes.func.isRequired,
    prevObject: PropTypes.array,
    sortingFunc: PropTypes.func.isRequired,
}

SortingButtons.defaultProps = {
    firstOption: PropTypes.shape({
        default: false,
    }),
    secondOption: PropTypes.shape({
        default: false,
    }),
    prevObject: null,
}

export default SortingButtons
