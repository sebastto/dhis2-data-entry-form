import React from 'react'
import PropTypes from 'prop-types'
import { Chip } from '@dhis2/ui-core'

import { FormState } from '../DataEntryBox/DataEntryBox'

import './FacilityCard.css'

const FacilityCard = ({ id, displayName, readOnly, dataSets, onClick }) => {
    const deadlines = {
        closeDue: 0,
        overDue: 0,
    }

    dataSets.forEach(dataSet => {
        if (dataSet.formState === FormState.CLOSEDUE) {
            deadlines.closeDue = deadlines.closeDue + 1
        } else if (dataSet.formState === FormState.OVERDUE) {
            deadlines.overDue = deadlines.overDue + 1
        }
    })

    return (
        <button className="facility-card" onClick={onClick}>
            <span className="facility-card-title">{displayName}</span>
            <span className="facility-card-deadlines">
                {deadlines.overDue > 0 ? (
                    <Chip className="chip-expired">
                        {deadlines.overDue > 99
                            ? '99+'
                            : deadlines.overDue.toLocaleString()}
                    </Chip>
                ) : (
                    ''
                )}
                {deadlines.closeDue > 0 ? (
                    <Chip className="chip-due">
                        {deadlines.closeDue > 99
                            ? '99+'
                            : deadlines.closeDue.toLocaleString()}
                    </Chip>
                ) : (
                    ''
                )}
            </span>
        </button>
    )
}

FacilityCard.propTypes = {
    title: PropTypes.string.isRequired,
    deadlines: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default FacilityCard
