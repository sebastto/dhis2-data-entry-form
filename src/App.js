import React, { useState, useEffect } from 'react'
import FormOverviewLayout from './components/layouts/FormOverviewLayout/FormOverviewLayout'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout/FacilityOverviewLayout'
import { TabBar, Tab } from '@dhis2/ui-core'
import { useDataEngine } from '@dhis2/app-runtime'
import { getAllOrganisationData } from './api/Api'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import './App.css'

const MyApp = () => {
    const engine = useDataEngine()
    const [selectedFacility, setSelectedFacility] = useState(null)
    const [facilities, setFacilities] = useState(undefined)
    const [dataSets, setDataSets] = useState(null)

    useEffect(() => {
        /* Defaults to first facility in list */
        if (facilities) {
            setSelectedFacility({
                displayName: facilities[0].title,
                id: facilities[0].id,
            })
        }
    }, [facilities])

    useEffect(() => {
        getAllOrganisationData(engine).then(
            ({ organisations, viewOrganisations, dataSets }) => {
                setDataSets(dataSets)
                setFacilities(
                    organisations
                        .concat(viewOrganisations)
                        .map(organisation => {
                            return {
                                title: organisation.displayName,
                                deadlines: {
                                    expired: 1,
                                    due: 6,
                                },
                                id: organisation.id,
                                onClick: () => {
                                    setSelectedFacility({
                                        displayName: organisation.displayName,
                                        id: organisation.id,
                                    })
                                    setMobileActiveTab('forms')
                                    window.scrollTo(0, 0)
                                },
                            }
                        })
                )
            }
        )
    }, [])

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
                    hidden={
                        !desktopView && mobileActiveTab !== 'facilities'
                            ? 'hidden-facility'
                            : ''
                    }
                    mobileView={!desktopView ? 'max-width' : ''}
                    facilities={facilities}
                />
                {selectedFacility && (
                    <FormOverviewLayout
                        hidden={
                            !desktopView && mobileActiveTab !== 'forms'
                                ? 'hidden-form'
                                : ''
                        }
                        mobileView={!desktopView ? 'max-width' : ''}
                        selectedFacility={selectedFacility}
                        dataSets={dataSets}
                    />
                )}
                {!desktopView && (
                    <nav className="mobile-nav">
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
                    </nav>
                )}
            </div>
        </>
    )
}

export default MyApp
