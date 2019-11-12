import React, { useState, useEffect } from 'react'
import FormOverviewLayout from './components/layouts/FormOverviewLayout/FormOverviewLayout'
import FacilityOverviewLayout from './components/layouts/FacilityOverviewLayout/FacilityOverviewLayout'
import { TabBar, Tab } from '@dhis2/ui-core'
import { useDataEngine } from '@dhis2/app-runtime'
import { getAllOrganisationData } from './api/Api'
import FacilityArrow from './components/ui/FacilityArrow/FacilityArrow'
import classNames from 'classNames'
import { processDataSets } from './utils/DataSetProcessing'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import './App.css'

const MyApp = () => {
    const engine = useDataEngine()
    const desktopView = useMediaQuery('(min-width:600px)')

    const [selectedFacility, setSelectedFacility] = useState(null)
    const [facilities, setFacilities] = useState(undefined)

    const [mobileActiveTab, setMobileActiveTab] = useState('facilities')

    useEffect(() => {
        getAllOrganisationData(engine).then(({ organisations, dataSets }) => {
            const processedDataSets = processDataSets(dataSets)
            console.log(processedDataSets)

            const processedfacilities = organisations.map(organisation => {
                return {
                    id: organisation.id,
                    title: organisation.displayName,
                    readOnly: organisation.readOnly,
                    dataSets: processedDataSets[organisation.id],
                }
            })

            console.log(processedfacilities)

            setFacilities(processedfacilities)
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
                        !desktopView && mobileActiveTab !== 'facilities'
                            ? 'hidden-facility'
                            : ''
                    }
                    mobileView={!desktopView ? 'max-width' : ''}
                    facilities={facilities}
                    setSelectedFacility={setSelectedFacility}
                />
                {selectedFacility ? (
                    <FormOverviewLayout
                        hidden={
                            !desktopView && mobileActiveTab !== 'forms'
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
                                selected={mobileActiveTab === 'facilities'}
                                onClick={() => setMobileActiveTab('facilities')}
                            >
                                Facilities
                            </Tab>
                            <Tab
                                disabled={!selectedFacility}
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
