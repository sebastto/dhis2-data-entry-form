import React from 'react'
import PropTypes from 'prop-types'
import { Chip } from '@dhis2/ui-core'
import { VALUE_OVER_99 } from '../../../constants/constants'

import './FacilityCard.css'

const FacilityCard = ({ displayName, onClick, deadlines, ...props }) => {
    return (
        <button className="facility-card" onClick={onClick}>
            <span className="facility-card-title">{displayName}</span>
            <span className="facility-card-deadlines">
                {deadlines.overDue > 0 ? (
                    <Chip className="chip-expired">
                        {deadlines.overDue > 99
                            ? VALUE_OVER_99
                            : deadlines.overDue.toLocaleString()}
                    </Chip>
                ) : (
                    ''
                )}
                {deadlines.closeDue > 0 ? (
                    <Chip className="chip-due">
                        {deadlines.closeDue > 99
                            ? VALUE_OVER_99
                            : deadlines.closeDue.toLocaleString()}
                    </Chip>
                ) : (
                    ''
                )}
            </span>
        </button>
    )
}

const deadlineShape = {
    closeDue: PropTypes.number.isRequired,
    overDue: PropTypes.number.isRequired,
}

FacilityCard.propTypes = {
    displayName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    deadlines: PropTypes.shape(deadlineShape).isRequired,
}

export default FacilityCard
