import React from 'react'

import ArrowIcon from '../../icons/ArrowIcon/ArrowIcon'

import './FacilityArrow.css'

const FacilityArrow = () => {
    return (
        <div className={'facility-arrow-container'}>
            <ArrowIcon className={'arrow'} />
            <p className={'arrow-text'}>Choose a facility to get started!</p>
        </div>
    )
}

export default FacilityArrow
