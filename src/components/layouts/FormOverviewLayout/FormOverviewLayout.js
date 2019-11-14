import React, { useEffect, useState } from 'react'
import classNames from 'classNames'
import { TabBar, Tab } from '@dhis2/ui-core'
import AppHeader from '../../ui/AppHeader/AppHeader'
import SearchBar from '../../ui/SearchBar/SearchBar'
import DataEntryBox from '../../ui/DataEntryBox/DataEntryBox'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import SimpleBar from 'simplebar-react'
import {
    FORMS_SEARCH_PLACEHOLDER,
    SORTING_KEY_NAME,
    SORTING_KEY_DUE,
    FORM_TITLE,
    DUE_DATE_TITLE,
} from '../../../constants/constants'

import './FormOverviewLayout.css'
import { FORM_STATE } from '../../../constants/enums'

const FormOverviewLayout = ({ hidden, mobileView, selectedFacility }) => {
    const [searchInput, setSearchInput] = useState('')
    const [formStateTab, setFormStateTab] = useState(FORM_STATE.NOTSET)
    const [displayedForms, setDisplayedForms] = useState(undefined)
    const [formStateCount, setFormStateCount] = useState({})

    const ref = React.createRef()

    useEffect(() => {
        if (ref.current) {
            ref.current.getScrollElement().scrollTop = 0
        }

        const count = {}
        count[FORM_STATE.NOTCLOSEDUE] = 0
        count[FORM_STATE.CLOSEDUE] = 0
        count[FORM_STATE.OVERDUE] = 0
        count[FORM_STATE.EXPIRED] = 0
        count[FORM_STATE.COMPLETED] = 0
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
                    placeholder={FORMS_SEARCH_PLACEHOLDER}
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                />
                <FacilityTabs
                    formStateTab={formStateTab}
                    setFormStateTab={setFormStateTab}
                    forms={formStateCount}
                    myRef={ref}
                />
            </div>
            <SortingButtons
                key={selectedFacility.displayName}
                firstOption={{
                    key: SORTING_KEY_NAME,
                    title: FORM_TITLE,
                }}
                secondOption={{
                    key: SORTING_KEY_DUE,
                    title: DUE_DATE_TITLE,
                    default: true,
                }}
                objectToSet={setDisplayedForms}
                prevObject={selectedFacility.dataSets}
                sortingFunc={(a, b) => a.dueDate - b.dueDate}
                ref={ref}
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
                                    formStateTab == FORM_STATE.NOTSET)
                            ) {
                                return (
                                    <DataEntryBox
                                        {...form}
                                        /* form.id is not uniqe, assume form.id + faciliyname is */
                                        key={
                                            form.id +
                                            form.instanceNr +
                                            form.displayName
                                        }
                                    />
                                )
                            }
                        })}
                </SimpleBar>
            </section>
        </div>
    )
}

const changeTabs = (func, formState, myRef) => {
    func(formState)
    if (myRef.current) {
        myRef.current.getScrollElement().scrollTop = 0
    }
}

const FacilityTabs = ({ formStateTab, setFormStateTab, forms, myRef }) => (
    <TabBar>
        <Tab
            selected={formStateTab === FORM_STATE.NOTSET}
            onClick={() =>
                changeTabs(setFormStateTab, FORM_STATE.NOTSET, myRef)
            }
        >
            All
        </Tab>
        <Tab
            selected={formStateTab === FORM_STATE.CLOSEDUE}
            onClick={() =>
                changeTabs(setFormStateTab, FORM_STATE.CLOSEDUE, myRef)
            }
            disabled={forms[FORM_STATE.CLOSEDUE] < 1}
        >
            Due soon
        </Tab>
        <Tab
            selected={formStateTab === FORM_STATE.OVERDUE}
            onClick={() =>
                changeTabs(setFormStateTab, FORM_STATE.OVERDUE, myRef)
            }
            disabled={forms[FORM_STATE.OVERDUE] < 1}
        >
            Overdue
        </Tab>
        <Tab
            selected={formStateTab === FORM_STATE.EXPIRED}
            onClick={() =>
                changeTabs(setFormStateTab, FORM_STATE.EXPIRED, myRef)
            }
            disabled={forms[FORM_STATE.EXPIRED] < 1}
        >
            Expired
        </Tab>
        <Tab
            selected={formStateTab === FORM_STATE.COMPLETED}
            onClick={() =>
                changeTabs(setFormStateTab, FORM_STATE.COMPLETED, myRef)
            }
            disabled={forms[FORM_STATE.COMPLETED] < 1}
        >
            Completed
        </Tab>
    </TabBar>
)

export default FormOverviewLayout
