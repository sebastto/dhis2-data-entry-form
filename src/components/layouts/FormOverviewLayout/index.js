import React, { useState } from 'react'
import AppHeader from '../../ui/AppHeader'
import SearchBar from '../../ui/SearchBar'
import { TabBar, Tab } from '@dhis2/ui-core'

import './index.css'
import DataEntryBox from '../../ui/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons'

const testForms = [
    {
        title: 'Child health',
        date: '20.10',
        color: '#891515',
        key: 0,
    },
    {
        title: 'Clinical Monitoring Checklist',
        date: '21.10',
        color: '#FFC324',
        key: 1,
    },
    {
        title: 'Life-saving commodities',
        date: '05.11',
        color: '#212934',
        key: 2,
    },
]

const FormOverviewLayout = () => {
    const [selectedFacility, setSelectedFacility] = useState(
        'Undefined facility'
    )
    const [displayedForms, setdisplayedForms] = useState(testForms)

    console.log(displayedForms)

    return (
        <>
            <div className="form-overview-light-container">
                <SearchBar placeholder="Search form" onChange={() => {}} />
                <FacilityTabs />
            </div>
            <section className="form-overview-form-section">
                <SortingButtons
                    labelOne="Form title"
                    labelTwo="Due date"
                    onClick={() => {}}
                />
                <Forms displayedForms={displayedForms} />
            </section>
        </>
    )
}

const FacilityTabs = () => (
    <TabBar>
        <Tab>All</Tab>
        <Tab selected>Due soon</Tab>
        <Tab>Completed</Tab>
        <Tab>Expired</Tab>
    </TabBar>
)

const Forms = ({ displayedForms }) => {
    const renderForms = displayedForms => {
        return displayedForms.map(form => {
            console.log(form)
            return (
                <DataEntryBox
                    title={form.title}
                    date={form.date}
                    color={form.color}
                    key={form.key}
                    clickprop={() =>
                        console.log('forward to Data Entry with form_id')
                    }
                ></DataEntryBox>
            )
        })
    }

    return <>{renderForms(displayedForms)}</>
}

export default FormOverviewLayout
