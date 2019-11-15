import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import CaretUpIcon from '../../icons/CaretUpIcon/CaretUpIcon'
import CaretDownIcon from '../../icons/CaretDownIcon/CaretDownIcon'
import Sorting from '../../../utils/Sorting'
import { SORT_ASC, SORT_DESC } from '../../../constants/constants'

import './SortingButtons.css'

const SortingButtons = React.forwardRef(
    (
        {
            className,
            firstOption,
            secondOption,
            sortingFunc,
            sortingFuncConditionalReverse,
            objectToSet,
            prevObject,
        },
        ref
    ) => {
        /* Carets by default are with pointy  side up for names (chronoligcal) and for dates (oldest first)*/
        const [firstCaretUp, setFirstCaret] = useState(
            firstOption.default ? firstOption.defaultState : null
        )
        const [secondCaretUp, setSecondCaret] = useState(
            secondOption.default ? secondOption.defaultState : null
        )

        /* Set default sorting options when null, follow Windows standard */
        const handleFirstOption = () => {
            setFirstCaret(firstCaretUp !== null ? !firstCaretUp : true)
            setSecondCaret(null)
        }

        const handleSecondOption = () => {
            setSecondCaret(secondCaretUp !== null ? !secondCaretUp : false)
            setFirstCaret(null)
        }

        useEffect(() => {
            /* Runs on componentDidMount aswell, to handle default caret cases */
            if (
                objectToSet &&
                prevObject &&
                sortingFunc &&
                sortingFuncConditionalReverse
            ) {
                if (firstCaretUp !== null) {
                    Sorting(
                        {
                            order: firstCaretUp ? SORT_ASC : SORT_DESC,
                            key: firstOption.key,
                        },
                        { objectToSet, prevObject },
                        sortingFunc
                    )
                } else if (secondCaretUp !== null) {
                    Sorting(
                        {
                            order: secondCaretUp ? SORT_ASC : SORT_DESC,
                            key: secondOption.key,
                        },
                        { objectToSet, prevObject },
                        secondCaretUp
                            ? sortingFunc
                            : sortingFuncConditionalReverse
                    )
                }
                if (ref.current) {
                    ref.current.getScrollElement().scrollTop = 0
                }
            }
        }, [firstCaretUp, secondCaretUp, prevObject])

        return (
            <div className={className}>
                <button
                    className={'first-option ' + firstCaretUp}
                    onClick={handleFirstOption}
                >
                    {firstOption.title}
                    {firstCaretUp === null ? (
                        <CaretUpIcon />
                    ) : firstCaretUp ? (
                        <CaretUpIcon />
                    ) : (
                        <CaretDownIcon />
                    )}
                </button>
                <button
                    className={'second-option ' + secondCaretUp}
                    onClick={handleSecondOption}
                >
                    {secondOption.title}
                    {secondCaretUp ? <CaretUpIcon /> : <CaretDownIcon />}
                </button>
            </div>
        )
    }
)

const optionShape = {
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    default: PropTypes.bool,
    defaultState: PropTypes.bool,
}

SortingButtons.propTypes = {
    className: PropTypes.string,
    firstOption: PropTypes.shape(optionShape).isRequired,
    secondOption: PropTypes.shape(optionShape).isRequired,
    objectToSet: PropTypes.func.isRequired,
    prevObject: PropTypes.array,
    sortingFunc: PropTypes.func.isRequired,
    sortingFuncConditionalReverse: PropTypes.func.isRequired,
}

SortingButtons.defaultProps = {
    className: 'sortingbuttons-container',
    firstOption: PropTypes.shape({
        default: false,
        defaultState: true,
    }),
    secondOption: PropTypes.shape({
        default: false,
        defaultState: true,
    }),
    prevObject: null,
}

export default SortingButtons
