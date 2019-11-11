import React from 'react'
import { TiArrowBack } from 'react-icons/ti'

import './FacilityArrow.css'

const FacilityArrow = () => {
    return (
        <div className={'facility-arrow-container'}>
            <TiArrowBack className={'arrow'} />
            <p className={'arrow-text'}>Choose a facility to get started!</p>
        </div>
    )
}

export default FacilityArrow
