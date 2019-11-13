import React from 'react'
import PropTypes from 'prop-types'

const ExpandIcon = props => {
    const { className } = props
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
        </svg>
    )
}

ExpandIcon.propTypes = {
    className: PropTypes.string,
}

export default ExpandIcon
