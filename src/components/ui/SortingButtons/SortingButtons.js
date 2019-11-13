import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

import Sorting from '../../../utils/Sorting'

import './SortingButtons.css'

const SortingButtons = props => {
    const {
        firstOption,
        secondOption,
        sortingFunc,
        objectToSet,
        prevObject,
    } = props

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
        /* Runs on componentDidMount aswell, to handle default caret cases */
        if (objectToSet && prevObject && sortingFunc) {
            if (firstCaretUp !== null) {
                Sorting(
                    {
                        order: firstCaretUp ? 'asc' : 'desc',
                        key: firstOption.key,
                    },
                    { objectToSet, prevObject },
                    sortingFunc
                )
            } else if (secondCaretUp !== null) {
                Sorting(
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
        <div className={props.className}>
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
    className: PropTypes.string,
    firstOption: PropTypes.shape(optionShape).isRequired,
    secondOption: PropTypes.shape(optionShape).isRequired,
    objectToSet: PropTypes.func.isRequired,
    prevObject: PropTypes.array,
    sortingFunc: PropTypes.func.isRequired,
}

SortingButtons.defaultProps = {
    className: 'sortingbuttons-container',
    firstOption: PropTypes.shape({
        default: false,
    }),
    secondOption: PropTypes.shape({
        default: false,
    }),
    prevObject: null,
}

export default SortingButtons
