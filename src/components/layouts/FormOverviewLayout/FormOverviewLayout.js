import React, { useEffect, useState } from 'react'
import classNames from 'classNames'
import { TabBar, Tab } from '@dhis2/ui-core'
import AppHeader from '../../ui/AppHeader/AppHeader'
import SearchBar from '../../ui/SearchBar/SearchBar'
import DataEntryBox, { FormState } from '../../ui/DataEntryBox/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import SimpleBar from 'simplebar-react'

import './FormOverviewLayout.css'

const FormOverviewLayout = ({ hidden, mobileView, selectedFacility }) => {
    const [searchInput, setSearchInput] = useState('')
    const [formStateTab, setFormStateTab] = useState(FormState.NOTSET)
    const [displayedForms, setDisplayedForms] = useState(undefined)
    const [formStateCount, setFormStateCount] = useState({})

    const ref = React.createRef()

    useEffect(() => {
        if (ref.current) {
            ref.current.getScrollElement().scrollTop = 0
        }

        const count = {}
        count[FormState.NOTCLOSEDUE] = 0
        count[FormState.CLOSEDUE] = 0
        count[FormState.OVERDUE] = 0
        count[FormState.EXPIRED] = 0
        count[FormState.COMPLETED] = 0
        selectedFacility.dataSets.forEach(dataSet => {
            count[dataSet.formState] += 1
        })

        setFormStateCount(count)
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
                    forms={formStateCount}
                />
            </div>
            <SortingButtons
                key={selectedFacility.displayName}
                firstOption={{
                    key: 'displayName',
                    title: 'Form title',
                }}
                secondOption={{
                    key: 'due',
                    title: 'Due date',
                    default: true,
                    defaultState: true,
                }}
                objectToSet={setDisplayedForms}
                prevObject={selectedFacility.dataSets}
                sortingFunc={(a, b) => a.dueDate - b.dueDate}
            />
            <section className="form-overview-form-section">
                <SimpleBar style={{ height: '100%' }} ref={ref}>
                    {displayedForms &&
                        displayedForms.map(form => {
                            if (
                                form.displayName
                                    .toLocaleLowerCase()
                                    .startsWith(
                                        searchInput.toLocaleLowerCase()
                                    ) &&
                                (form.formState == formStateTab ||
                                    formStateTab == FormState.NOTSET)
                            ) {
                                return (
                                    <DataEntryBox
                                        {...form}
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
            disabled={props.forms[FormState.CLOSEDUE] < 1}
        >
            Due soon
        </Tab>
        <Tab
            selected={props.formStateTab === FormState.OVERDUE}
            onClick={() => props.setFormStateTab(FormState.OVERDUE)}
            disabled={props.forms[FormState.OVERDUE] < 1}
        >
            Overdue
        </Tab>
        <Tab
            selected={props.formStateTab === FormState.EXPIRED}
            onClick={() => props.setFormStateTab(FormState.EXPIRED)}
            disabled={props.forms[FormState.EXPIRED] < 1}
        >
            Expired
        </Tab>
        <Tab
            selected={props.formStateTab === FormState.COMPLETED}
            onClick={() => props.setFormStateTab(FormState.COMPLETED)}
            disabled={props.forms[FormState.COMPLETED] < 1}
        >
            Completed
        </Tab>
    </TabBar>
)

export default FormOverviewLayout
