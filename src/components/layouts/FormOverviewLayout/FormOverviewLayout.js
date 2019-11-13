import React, { useEffect, useState } from 'react'
import classNames from 'classNames'
import { TabBar, Tab } from '@dhis2/ui-core'
import AppHeader from '../../ui/AppHeader/AppHeader'
import SearchBar from '../../ui/SearchBar/SearchBar'
import { DataEntryBox, FormState } from '../../ui/DataEntryBox/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import SimpleBar from 'simplebar-react'

import './FormOverviewLayout.css'

const FormOverviewLayout = ({ hidden, mobileView, selectedFacility }) => {
    const [searchInput, setSearchInput] = useState('')
    const [formStateTab, setFormStateTab] = useState(FormState.NOTSET)
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
                <FacilityTabs
                    formStateTab={formStateTab}
                    setFormStateTab={setFormStateTab}
                />
            </div>
            <SortingButtons
                key={selectedFacility.displayName}
                firstOption={{
                    key: 'title',
                    title: 'Form title',
                }}
                secondOption={{
                    key: 'due',
                    title: 'Due date',
                    default: true,
                }}
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
                                .startsWith(searchInput.toLocaleLowerCase()) &&
                            (form.formState == formStateTab ||
                                formStateTab == FormState.NOTSET)
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

const FacilityTabs = props => (
    <TabBar>
        <Tab
            selected={props.formStateTab === FormState.NOTSET}
            onClick={() => props.setFormStateTab(FormState.NOTSET)}
        >
            All
        </Tab>
        <Tab
            selected={props.formStateTab === FormState.CLOSEDUE}
            onClick={() => props.setFormStateTab(FormState.CLOSEDUE)}
        >
            Due soon
        </Tab>
        <Tab
            selected={props.formStateTab === FormState.OVERDUE}
            onClick={() => props.setFormStateTab(FormState.OVERDUE)}
        >
            Overdue
        </Tab>
        <Tab
            selected={props.formStateTab === FormState.EXPIRED}
            onClick={() => props.setFormStateTab(FormState.EXPIRED)}
        >
            Expired
        </Tab>
        <Tab
            selected={props.formStateTab === FormState.COMPLETED}
            onClick={() => props.setFormStateTab(FormState.COMPLETED)}
        >
            Completed
        </Tab>
    </TabBar>
)

export default FormOverviewLayout
