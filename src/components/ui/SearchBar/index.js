import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '@dhis2/ui-core'

import SearchIcon from '../../icons/SearchIcon'

import './index.css'

const SearchBar = props => {
    const { placeholder, onChange } = props

    return (
        <div className="search-container">
            <SearchIcon className="search-icon" />
            <InputField
                filled
                dense
                label={placeholder}
                name="Search"
                onChange={e => onChange(e)}
                type="text"
                className="search-input"
            />
        </div>
    )
}

SearchBar.propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default SearchBar
