import React from 'react'
import { TiArrowBack } from 'react-icons/ti'

import { INRO_TEXT } from '../../../constants/constants'

import './FacilityArrow.css'

const FacilityArrow = () => {
    return (
        <div className={'facility-arrow-container'}>
            <TiArrowBack className={'arrow'} />
            <p className={'arrow-text'}>{INRO_TEXT}</p>
        </div>
    )
}

export default FacilityArrow
