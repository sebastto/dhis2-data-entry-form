import React from 'react'
import PropTypes from 'prop-types'

const ReadOnlyIcon = ({ className }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
        >
            <path
                id="svg_2"
                d="m14.06,9.02l0.92,0.92l-9.06,9.06l-0.92,0l0,-0.92l9.06,-9.06m3.6,-6.02c-0.25,0 -0.51,0.1 -0.7,0.29l-1.83,1.83l3.75,3.75l1.83,-1.83c0.39,-0.39 0.39,-1.02 0,-1.41l-2.34,-2.34c-0.2,-0.2 -0.45,-0.29 -0.71,-0.29zm-3.6,3.19l-11.06,11.06l0,3.75l3.75,0l11.06,-11.06l-3.75,-3.75z"
            />
            <line
                id="svg_3"
                y2="19.781249"
                x2="18.399988"
                y1="4.981259"
                x1="4.399997"
                strokeWidth="2"
                stroke="#000"
                fill="none"
            />
            <path id="svg_1" d="m0,0l24,0l0,24l-24,0l0,-24z" fill="none" />
        </svg>
    )
}

ReadOnlyIcon.propTypes = {
    className: PropTypes.string,
}

export default ReadOnlyIcon
