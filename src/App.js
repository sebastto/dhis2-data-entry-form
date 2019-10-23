import React, { useState } from 'react'

import './App.css'
import FormOverviewLayout from './components/layouts/FormOverviewLayout'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout'
import { TabBar, Tab } from '@dhis2/ui-core'

import useMediaQuery from '@material-ui/core/useMediaQuery'

const MyApp = () => {
    const [selectedFacility, setSelectedFacility] = useState(
        'Undefined facility'
    )

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
                />
                <FormOverviewLayout
                    hidden={!desktopView && mobileActiveTab !== 'forms'}
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
                            Facilites
                        </Tab>
                    </TabBar>
                )}
            </div>
        </>
    )
}

export default MyApp
