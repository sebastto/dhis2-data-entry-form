import React from 'react'
import PropTypes from 'prop-types'

const ShrinkIcon = ({ className }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12,8l-6,6 1.41,1.41L12,10.83l4.59,4.58L18,14z" />
        </svg>
    )
}

ShrinkIcon.propTypes = {
    className: PropTypes.string,
}

ShrinkIcon.defaultProps = {
    className: 'shrink-icon',
}

export default ShrinkIcon
