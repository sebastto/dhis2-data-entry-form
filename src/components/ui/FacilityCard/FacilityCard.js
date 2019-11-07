import React from 'react'
import PropTypes from 'prop-types'
import { Chip } from '@dhis2/ui-core'

import './FacilityCard.css'

const FacilityCard = props => {
    const { title, deadlines, onClick } = props

    return (
        <button className="facility-card" onClick={onClick}>
            <span className="facility-card-title">{title}</span>
            <span className="facility-card-deadlines">
                {deadlines.expired > 0 ? (
                    <Chip className="chip-expired">
                        {deadlines.expired > 99
                            ? '99+'
                            : deadlines.expired.toLocaleString()}
                    </Chip>
                ) : (
                    ''
                )}
                {deadlines.due > 0 ? (
                    <Chip className="chip-due">
                        {deadlines.due > 99
                            ? '99+'
                            : deadlines.due.toLocaleString()}
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
