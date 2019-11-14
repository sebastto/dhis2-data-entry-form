import React, { useState, useEffect } from 'react'
import FormOverviewLayout from './components/layouts/FormOverviewLayout/FormOverviewLayout'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout/FacilityOverviewLayout'
import { TabBar, Tab } from '@dhis2/ui-core'
import { useDataEngine } from '@dhis2/app-runtime'
import { getAllOrganisationData } from './api/Api'
import FacilityArrow from './components/ui/FacilityArrow/FacilityArrow'
import classNames from 'classNames'
import { processDataSets } from './utils/DataSetProcessing'
import { FACILITIES, FORMS, MIN_WIDTH_APP } from './constants/constants'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import './App.css'

const MyApp = () => {
    const engine = useDataEngine()
    const desktopView = useMediaQuery(MIN_WIDTH_APP)

    const [selectedFacility, setSelectedFacility] = useState(null)
    const [facilities, setFacilities] = useState(undefined)
    const [mobileActiveTab, setMobileActiveTab] = useState(FACILITIES)

    useEffect(() => {
        getAllOrganisationData(engine).then(({ organisations }) => {
            setFacilities(processDataSets(organisations))
        })
    }, [])

    return (
        <>
            <div
                className={classNames('app-container', {
                    'tab-view': !desktopView,
                })}
            >
                <FacilityOverviewLayout
                    hidden={
                        !desktopView && mobileActiveTab !== FACILITIES
                            ? 'hidden-facility'
                            : ''
                    }
                    mobileView={!desktopView ? 'max-width' : ''}
                    facilities={facilities}
                    setSelectedFacility={setSelectedFacility}
                    setMobileActiveTab={setMobileActiveTab}
                />
                {selectedFacility ? (
                    <FormOverviewLayout
                        hidden={
                            !desktopView && mobileActiveTab !== FORMS
                                ? 'hidden-form'
                                : ''
                        }
                        mobileView={!desktopView ? 'max-width' : ''}
                        selectedFacility={selectedFacility}
                    />
                ) : (
                    <FacilityArrow />
                )}
                {!desktopView && (
                    <nav className="mobile-nav">
                        <TabBar fixed>
                            <Tab
                                selected={mobileActiveTab === FACILITIES}
                                onClick={() => setMobileActiveTab(FACILITIES)}
                            >
                                Facilities
                            </Tab>
                            <Tab
                                disabled={!selectedFacility}
                                selected={mobileActiveTab === FORMS}
                                onClick={() => setMobileActiveTab(FORMS)}
                            >
                                Forms
                            </Tab>
                        </TabBar>
                    </nav>
                )}
            </div>
        </>
    )
}

export default MyApp
