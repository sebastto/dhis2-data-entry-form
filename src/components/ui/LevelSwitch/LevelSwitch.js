import React from 'react'
import { Switch } from '@dhis2/ui-core'
import PropTypes from 'prop-types'

import './LevelSwitch.css'

const LevelSwitch = ({ value, onChange }) => {
    return (
        <div className="level-select">
            <Switch
                checked={value}
                label="Show Children"
                name="parents"
                onChange={e => {
                    onChange(e.target.checked)
                }}
            />
        </div>
    )
}

LevelSwitch.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default LevelSwitch
