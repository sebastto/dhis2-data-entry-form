import React, { useEffect, useState } from 'react'
import { TabBar, Tab } from '@dhis2/ui-core'
import AppHeader from '../../ui/AppHeader/AppHeader'
import SearchBar from '../../ui/SearchBar/SearchBar'
import DataEntryBox from '../../ui/DataEntryBox/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import { getDataSets } from '../../../api'

import './FormOverviewLayout.css'

const FormOverviewLayout = ({ hidden, selectedFacility }) => {
    const [searchInput, setSearchInput] = useState('')
    const [dataSets, setDataSets] = useState(null)
    const [displayedForms, setDisplayedForms] = useState(null)
    const [allDatesSet, setAllDatesSet] = useState(false)
    const [facilityName, setFacilityName] = useState(null)

    getDataSets(datasets => {
        setDataSets(datasets)
    })

    useEffect(() => {
        if (
            dataSets &&
            selectedFacility &&
            selectedFacility.displayName !== facilityName
        ) {
            setDisplayedForms(dataSets[selectedFacility.displayName])
            setFacilityName(selectedFacility.displayName)
        }
    }, [selectedFacility, dataSets])

    let containerClassName = 'form-overview-container'

    if (hidden) {
        containerClassName += ' hidden'
    }

    const setChildDate = childDate => {
        const tmpForms = displayedForms
        if (childDate.date === '') tmpForms[childDate.id].due = new Date(0)
        else tmpForms[childDate.id].due = childDate.date
        setDisplayedForms(tmpForms)
        setAllDatesSet(tmpForms.every(forms => forms.due))
    }

    const sortOnChange = sortingChoices => {
        const { order, key } = sortingChoices
        if (displayedForms) {
            switch (key) {
                case 'due':
                    if (order === 'asc') {
                        setDisplayedForms(
                            [...displayedForms].sort((a, b) => a.due - b.due)
                        )
                    } else if (order === 'desc') {
                        setDisplayedForms(
                            [...displayedForms].sort((a, b) => b.due - a.due)
                        )
                    }
                    break
                case 'title':
                    if (order === 'asc') {
                        setDisplayedForms(
                            [...displayedForms].sort((a, b) =>
                                a.title.toLocaleLowerCase() >
                                b.title.toLocaleLowerCase()
                                    ? 1
                                    : -1
                            )
                        )
                    } else if (order === 'desc') {
                        setDisplayedForms(
                            [...displayedForms].sort((a, b) =>
                                a.title.toLocaleLowerCase() >
                                b.title.toLocaleLowerCase()
                                    ? -1
                                    : 1
                            )
                        )
                    }
                    break
            }
        }
    }

    return (
        <div className={containerClassName}>
            <AppHeader
                title="Form Overview"
                subtitle={selectedFacility.displayName}
            />
            <div className="form-overview-light-container">
                <SearchBar
                    placeholder="Search form"
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                />
                <FacilityTabs />
            </div>
            <section className="form-overview-form-section">
                {displayedForms && (
                    <>
                        {allDatesSet && (
                            <SortingButtons
                                firstOption={{
                                    key: 'title',
                                    title: 'Form title',
                                }}
                                secondOption={{
                                    key: 'due',
                                    title: 'Due date',
                                    default: true,
                                }}
                                onClick={sortOnChange}
                            />
                        )}

                        {displayedForms.map((form, index) => {
                            if (
                                form.title
                                    .toLocaleLowerCase()
                                    .startsWith(searchInput.toLocaleLowerCase())
                            ) {
                                return (
                                    <DataEntryBox
                                        facilityName={
                                            selectedFacility.displayName
                                        }
                                        ref={setChildDate}
                                        title={form.title}
                                        periodType={form.periodType}
                                        formState={form.formState}
                                        formId={index}
                                        facilityId={selectedFacility.id}
                                        /* form.id is not uniqe, assume form.id + faciliyname is */
                                        key={form.id + facilityName}
                                        editUrl={
                                            process.env
                                                .REACT_APP_DHIS2_BASE_URL +
                                            process.env
                                                .REACT_APP_DHIS2_FORM_EDIT_URL
                                        }
                                    />
                                )
                            }
                        })}
                    </>
                )}
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
