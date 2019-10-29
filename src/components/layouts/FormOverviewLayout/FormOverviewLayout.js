import React, { useState } from 'react'
import { TabBar, Tab } from '@dhis2/ui-core'
import AppHeader from '../../ui/AppHeader/AppHeader'
import SearchBar from '../../ui/SearchBar/SearchBar'
import DataEntryBox, { FormState } from '../../ui/DataEntryBox/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'

import './FormOverviewLayout.css'

const testForms = [
    {
        title: 'Clinical Monitoring Checklist',
        periodType: 'Monthly',
        formState: FormState.ACTIVE,
    },
    {
        title: 'Child health',
        periodType: 'Quarterly',
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
    const [displayedForms, setDisplayedForms] = useState(testForms)
    const [searchInput, setSearchInput] = useState('')

    console.log(displayedForms)

    let containerClassName = 'form-overview-container'

    if (hidden) {
        containerClassName += ' hidden'
    }

    const setChildDate = childDate => {
        if (!displayedForms[childDate.id].due) {
            const tmpForms = displayedForms
            if (childDate.date === '') tmpForms[childDate.id].due = new Date(0)
            else tmpForms[childDate.id].due = childDate.date
            setDisplayedForms(tmpForms)
        }
    }

    const sortOnChange = sortingChoices => {
        console.log(sortingChoices)
        const { order, key } = sortingChoices
        switch (key) {
            case 'due':
                if (order === 'asc') {
                    setDisplayedForms(
                        [...displayedForms].sort((a, b) => {
                            return a.due - b.due
                        })
                    )
                } else if (order === 'desc') {
                    setDisplayedForms(
                        [...displayedForms].sort((a, b) => {
                            return b.due - a.due
                        })
                    )
                }
                break
            case 'title':
                if (order === 'asc') {
                    setDisplayedForms(
                        [...displayedForms].sort((a, b) => {
                            return a.title.toLocaleLowerCase() >
                                b.title.toLocaleLowerCase()
                                ? 1
                                : -1
                        })
                    )
                } else if (order === 'desc') {
                    setDisplayedForms(
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
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
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
                    ) {
                        return (
                            <DataEntryBox
                                ref={setChildDate}
                                title={form.title}
                                periodType={form.periodType}
                                formState={form.formState}
                                formId={index}
                                key={index}
                                clickprop={() =>
                                    console.log(
                                        'forward to Data Entry with form_id'
                                    )
                                }
                            />
                        )
                    }
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

export default FormOverviewLayout
