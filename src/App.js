import React, { useState, useEffect } from 'react'
import FormOverviewLayout from './components/layouts/FormOverviewLayout/FormOverviewLayout'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout/FacilityOverviewLayout'
import { TabBar, Tab } from '@dhis2/ui-core'
import { getOrganisation } from './api'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import './App.css'

const MyApp = () => {
    const [selectedFacility, setSelectedFacility] = useState({
        displayName: 'Undefined facility',
        id: 0,
    })
    const [facilities, setFacilities] = useState(undefined)

    getOrganisation(organisations => {
        setFacilities(
            organisations.map(organisation => {
                return {
                    title: organisation.displayName,
                    deadlines: {
                        expired: 1,
                        due: 6,
                    },
                    onClick: () => {
                        setSelectedFacility({
                            displayName: organisation.displayName,
                            id: organisation.id,
                        })
                    },
                }
            })
        )
    })

    const desktopView = useMediaQuery('(min-width:600px)')
    const [mobileActiveTab, setMobileActiveTab] = useState('facilities')

    let appContainerClassName = 'app-container'

    if (!desktopView) {
        appContainerClassName = 'app-container-tab-view'
    }

    return (
        <>
            <div className={appContainerClassName}>
                <FacilityOverviewLayout
                    hidden={!desktopView && mobileActiveTab !== 'facilities'}
                    mobileView={!desktopView}
                    facilities={facilities}
                />
                <FormOverviewLayout
                    hidden={!desktopView && mobileActiveTab !== 'forms'}
                    selectedFacility={selectedFacility}
                />
                {!desktopView && (
                    <TabBar fixed>
                        <Tab
                            selected={mobileActiveTab === 'facilities'}
                            onClick={() => setMobileActiveTab('facilities')}
                        >
                            Facilites
                        </Tab>
                        <Tab
                            selected={mobileActiveTab === 'forms'}
                            onClick={() => setMobileActiveTab('forms')}
                        >
                            Forms
                        </Tab>
                    </TabBar>
                )}
            </div>
        </>
    )
}

export default MyApp
