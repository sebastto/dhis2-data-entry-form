import React, { useEffect, useState } from 'react'
import { Tab, TabBar } from '@dhis2/ui-core'
import { useDataEngine } from '@dhis2/app-runtime'
import classNames from 'classNames'
import reactRouterDom from 'react-router-dom'
const { BrowserRouter, useLocation, useHistory } = reactRouterDom

import { getAllOrganisationData } from './api/Api'
import { processDataSets } from './utils/DataSetProcessing'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout/FacilityOverviewLayout'
import FacilityArrow from './components/ui/FacilityArrow/FacilityArrow'
import FormOverviewLayout from './components/layouts/FormOverviewLayout/FormOverviewLayout'
import { FACILITIES, FORMS, MIN_WIDTH_APP } from './constants/constants'
import useMedia from './utils/Media'

import './App.css'

const MyApp = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )
}

const App = () => {
    const location = useLocation()
    const history = useHistory()
    const engine = useDataEngine()
    const getCompleteFormEngine = useDataEngine()
    const desktopView = useMedia(MIN_WIDTH_APP)

    const [selectedFacility, setSelectedFacility] = useState(null)
    const [facilities, setFacilities] = useState(undefined)
    const [mobileActiveTab, setMobileActiveTab] = useState(FACILITIES)

    useEffect(() => {
        getAllOrganisationData(engine).then(({ organisations }) => {
            const facilities = processDataSets(
                organisations,
                getCompleteFormEngine
            )
            setFacilities(facilities)
            if (facilities.length === 1) {
                setMobileActiveTab(FORMS)
            }
        })
    }, [])

    useEffect(() => {
        if (facilities) {
            const selected = facilities.filter(
                e => e.displayName === location.pathname.substring(1)
            )
            if (selected.length === 1) {
                setSelectedFacility(selected[0])
                setMobileActiveTab('forms')
            } else {
                history.push('')
            }
        }
    }, [facilities])

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
                    selectedFacility={selectedFacility}
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
