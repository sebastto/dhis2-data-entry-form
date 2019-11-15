import React, { useEffect, useState } from 'react'
import { Tab, TabBar, AlertBar } from '@dhis2/ui-core'
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
    const [error, setError] = useState(null)

    useEffect(() => {
        setError(null)
        try {
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
        } catch (e) {
            console.error(e)
            setError(['error', e])
        }
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

    const getAlertBar = () => {
        let doneOne = false
        if (facilities) {
            if (facilities.length === 0) {
                doneOne = true
                return (
                    <AlertBar duration={2000} warning>
                        No facilities were found for this user.
                    </AlertBar>
                )
            } else if (facilities.length === 1) {
                return (
                    <AlertBar duration={4000}>
                        Only one facility was found for this user.
                    </AlertBar>
                )
            }
        }
        if (selectedFacility && !doneOne) {
            selectedFacility.dataSets = []
            if (selectedFacility.dataSets.length === 0) {
                return (
                    <AlertBar info duration={6000}>
                        This facility has no forms!
                    </AlertBar>
                )
            }
        }
        if (error) {
            return (
                <AlertBar warning>
                    Error occurred while retrieving data. The application might
                    still be usable.
                </AlertBar>
            )
        }
    }

    return (
        <>
            <div
                className="alert-bars"
                style={{
                    bottom: '100px',
                    width: '100%',
                    padding: '0 16px',
                    position: 'fixed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: '9999',
                }}
            >
                {facilities && (
                    <AlertBar duration={4000} icon success>
                        All information has been cached. The application is
                        available offline.
                    </AlertBar>
                )}
                {(facilities || selectedFacility || error) && getAlertBar()}
            </div>

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
                    desktopView && <FacilityArrow />
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
