import React, { useEffect, useState } from 'react'
import classNames from 'classNames'
import { TabBar, Tab } from '@dhis2/ui-core'
import AppHeader from '../../ui/AppHeader/AppHeader'
import SearchBar from '../../ui/SearchBar/SearchBar'
import DataEntryBox from '../../ui/DataEntryBox/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import SimpleBar from 'simplebar-react'

import './FormOverviewLayout.css'
import Sorting from '../../../utils/Sorting'

const FormOverviewLayout = ({ hidden, mobileView, selectedFacility }) => {
    const [searchInput, setSearchInput] = useState('')
    const [displayedForms, setDisplayedForms] = useState(
        selectedFacility.dataSets
    )
    const ref = React.createRef()

    useEffect(() => {
        setDisplayedForms(selectedFacility.dataSets)

        if (ref.current) {
            ref.current.getScrollElement().scrollTop = 0
        }
    }, [selectedFacility])

    return (
        <div
            className={classNames(
                'form-overview-container',
                hidden,
                mobileView
            )}
        >
            <AppHeader
                title="Form Overview"
                subtitle={selectedFacility && selectedFacility.displayName}
            />
            <div className="form-overview-light-container">
                <SearchBar
                    placeholder="Search form"
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                />
                <FacilityTabs />
            </div>
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
                onClick={Sorting}
                objectToSet={setDisplayedForms}
                prevObject={displayedForms}
                sortingFunc={object => object.dueDate}
            />
            <section className="form-overview-form-section">
                <SimpleBar style={{ height: '100%' }} ref={ref}>
                    {displayedForms.map((form, index) => {
                        if (
                            form.title
                                .toLocaleLowerCase()
                                .startsWith(searchInput.toLocaleLowerCase())
                        ) {
                            return (
                                <DataEntryBox
                                    title={form.title}
                                    dueDate={form.dueDate}
                                    formState={form.formState}
                                    /* form.id is not uniqe, assume form.id + faciliyname is */
                                    key={form.id + form.displayName}
                                />
                            )
                        }
                    })}
                </SimpleBar>
            </section>
        </div>
    )
}

const FacilityTabs = () => (
    <TabBar>
        <Tab>All</Tab>
        <Tab selected>Due soon</Tab>
        <Tab>Overdue</Tab>
        <Tab>Expired</Tab>
        <Tab>Completed</Tab>
    </TabBar>
)

export default FormOverviewLayout
