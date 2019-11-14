import React from 'react'
import { TiArrowBack } from 'react-icons/ti'

import { INTRO_TEXT } from '../../../constants/constants'

import './FacilityArrow.css'

const FacilityArrow = () => {
    return (
        <div className={'facility-arrow-container'}>
            <TiArrowBack className={'arrow'} />
            <p className={'arrow-text'}>{INTRO_TEXT}</p>
        </div>
    )
}

export default FacilityArrow
