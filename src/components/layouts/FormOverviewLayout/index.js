import React, { useState } from 'react'
import AppHeader from '../../ui/AppHeader'
import SearchBar from '../../ui/SearchBar'
import { TabBar, Tab } from '@dhis2/ui-core'

import './index.css'
import DataEntryBox, { Warning, FormState } from '../../ui/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons'

const testForms = [
    {
        title: 'Child health',
        periodType: 'Quarterly',
        formState: FormState.ACTIVE,
    },
    {
        title: 'Clinical Monitoring Checklist',
        periodType: 'Monthly',
        formState: FormState.ACTIVE,
    },
    {
        title: 'Life-saving commodities',
        periodType: 'WeeklyWednesday',
        formState: FormState.COMPLETED,
    },
]

const FormOverviewLayout = ({ hidden }) => {
    const [selectedFacility, setSelectedFacility] = useState(
        'Undefined facility'
    )
    const [displayedForms, setdisplayedForms] = useState(testForms)
    const [searchInput, setSearchInput] = useState('')

    console.log(displayedForms)

    let containerClassName = 'form-overview-container'

    if (hidden) {
        containerClassName += ' hidden'
    const searchOnChange = e => {
        setSearchInput(e.target.value)
    }

    const sortOnChange = sortingChoices => {
        const { order, key } = sortingChoices
        switch (key) {
            case 'due':
                if (order === 'asc') {
                    setdisplayedForms(
                        [...displayedForms].sort((a, b) => {
                            return a.date - b.date
                        })
                    )
                } else if (order === 'desc') {
                    setdisplayedForms(
                        [...displayedForms].sort((a, b) => {
                            return b.date - a.date
                        })
                    )
                }
                break
            case 'title':
                if (order === 'asc') {
                    setdisplayedForms(
                        [...displayedForms].sort((a, b) => {
                            return a.title.toLocaleLowerCase() >
                                b.title.toLocaleLowerCase()
                                ? 1
                                : -1
                        })
                    )
                } else if (order === 'desc') {
                    setdisplayedForms(
                        [...displayedForms].sort((a, b) => {
                            return a.title.toLocaleLowerCase() >
                                b.title.toLocaleLowerCase()
                                ? -1
                                : 1
                        })
                    )
                }
                break
        }
    }

    return (
        <div className={containerClassName}>
            <AppHeader title="Form Overview" subtitle={selectedFacility} />
            <div className="form-overview-light-container">
                <SearchBar
                    placeholder="Search form"
                    onChange={searchOnChange}
                />
                <FacilityTabs />
            </div>
            <section className="form-overview-form-section">
                <SortingButtons
                    firstOption={{ key: 'title', title: 'Form title' }}
                    secondOption={{
                        key: 'due',
                        title: 'Due date',
                        default: true,
                    }}
                    onClick={sortOnChange}
                />
                {displayedForms.map((form, index) => {
                    if (
                        form.title
                            .toLocaleLowerCase()
                            .startsWith(searchInput.toLocaleLowerCase())
                    )
                        return (
                            <DataEntryBox
                                title={form.title}
                                date={form.date}
                                color={form.color}
                                key={index}
                                onClick={() =>
                                    console.log(
                                        'forward to Data Entry with form_id'
                                    )
                                }
                            />
                        )
                })}
            </section>
        </div>
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
        return displayedForms.map((form, index) => {
            console.log(form)
            return (
                <DataEntryBox
                    title={form.title}
                    periodType={form.periodType}
                    formState={form.formState}
                    key={index}
                    clickprop={() =>
                        console.log('forward to Data Entry with form_id')
                    }
                />
            )
        })
    }

    return <>{renderForms(displayedForms)}</>
}

export default FormOverviewLayout
