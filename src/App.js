import React, { useState } from 'react'

import './App.css'
import AppHeader from './components/ui/AppHeader'
import FormOverviewLayout from './components/layouts/FormOverviewLayout'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout'

const MyApp = () => {
    const [selectedFacility, setSelectedFacility] = useState(
        'Undefined facility'
    )

    return (
        <>
            <AppHeader
                title="Form Overview"
                subtitle={selectedFacility}
            ></AppHeader>
            <FacilityOverviewLayout />
            <FormOverviewLayout />
        </>
    )
}

export default MyApp
