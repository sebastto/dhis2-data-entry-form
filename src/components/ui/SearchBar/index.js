import React from 'react'
import PropTypes from 'prop-types'
import { FaSearch } from 'react-icons/fa'

import './index.css'

const SearchBar = props => {
    const { placeholder, onChange } = props

    return (
        <div className="search-container">
            <FaSearch className="search-icon" />
            <input
                className="search-input"
                type="text"
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    )
}

SearchBar.propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default SearchBar
