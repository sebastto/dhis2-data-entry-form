import React, { useEffect, useState } from 'react'
import { Tab, TabBar } from '@dhis2/ui-core'
import { useDataEngine } from '@dhis2/app-runtime'
import classNames from 'classNames'

import { getAllOrganisationData } from './api/Api'
import { processDataSets } from './utils/DataSetProcessing'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout/FacilityOverviewLayout'
import FacilityArrow from './components/ui/FacilityArrow/FacilityArrow'
import FormOverviewLayout from './components/layouts/FormOverviewLayout/FormOverviewLayout'
import { FACILITIES, FORMS, MIN_WIDTH_APP } from './constants/constants'
import useMediaQuery from './utils/Media'

import './App.css'

const MyApp = () => {
    const engine = useDataEngine()
    const getCompleteFormEngine = useDataEngine()
    const desktopView = useMediaQuery(MIN_WIDTH_APP)

    const [selectedFacility, setSelectedFacility] = useState(null)
    const [facilities, setFacilities] = useState(undefined)
    const [mobileActiveTab, setMobileActiveTab] = useState(FACILITIES)

    useEffect(() => {
        getAllOrganisationData(engine).then(({ organisations }) => {
            setFacilities(processDataSets(organisations, getCompleteFormEngine))
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
