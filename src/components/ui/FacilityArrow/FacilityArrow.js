import React from 'react'

import ArrowIcon from '../../icons/ArrowIcon/ArrowIcon'

import { INTRO_TEXT } from '../../../constants/constants'

import './FacilityArrow.css'

const FacilityArrow = () => {
    return (
        <div className={'facility-arrow-container'}>
            <ArrowIcon className={'arrow'} />
            <p className={'arrow-text'}>{INTRO_TEXT}</p>
        </div>
    )
}

export default FacilityArrow
