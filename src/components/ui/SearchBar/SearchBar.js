import React from 'react'
import { InputField } from '@dhis2/ui-core'
import PropTypes from 'prop-types'

import SearchIcon from '../../icons/SearchIcon/SearchIcon'
import { SEARCHBAR_NAME } from '../../../constants/constants'

import './SearchBar.css'

const SearchBar = props => {
    const { placeholder, onChange, value } = props

    return (
        <div className="search-container">
            <SearchIcon className="search-icon" />
            <InputField
                filled
                dense
                label={placeholder}
                value={value}
                name={SEARCHBAR_NAME}
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
    value: PropTypes.string.isRequired,
}

export default SearchBar
