import React, { useEffect, useState } from 'react'
import { Tab, TabBar } from '@dhis2/ui-core'
import classNames from 'classNames'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import AppHeader from '../../ui/AppHeader/AppHeader'
import DataEntryBox from '../../ui/DataEntryBox/DataEntryBox'
import SearchBar from '../../ui/SearchBar/SearchBar'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import {
    DUE_DATE_TITLE,
    FORM_TITLE,
    FORMS_SEARCH_PLACEHOLDER,
    SORTING_KEY_DUE,
    SORTING_KEY_NAME,
} from '../../../constants/constants'
import { FORM_STATE } from '../../../constants/enums'

import './FormOverviewLayout.css'

const FormOverviewLayout = ({ hidden, mobileView, selectedFacility }) => {
    const [searchInput, setSearchInput] = useState('')
    const [formStateTab, setFormStateTab] = useState(FORM_STATE.NOTSET)
    const [displayedForms, setDisplayedForms] = useState(undefined)
    const [formStateCount, setFormStateCount] = useState({})

    const ref = React.createRef()

    useEffect(() => {
        setFormStateTab(FORM_STATE.NOTSET)

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
                readOnly={selectedFacility && selectedFacility.readOnly}
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
                    defaultState: true,
                }}
                objectToSet={setDisplayedForms}
                prevObject={selectedFacility.dataSets}
                sortingFunc={(a, b) =>
                    a.formState === FORM_STATE.EXPIRED ||
                    a.formState === FORM_STATE.COMPLETED ||
                    b.formState === FORM_STATE.EXPIRED ||
                    b.formState === FORM_STATE.COMPLETED
                        ? a.formState - b.formState
                        : a.dueDate - b.dueDate
                }
                sortingFuncConditionalReverse={(a, b) =>
                    a.formState === FORM_STATE.EXPIRED ||
                    a.formState === FORM_STATE.COMPLETED ||
                    b.formState === FORM_STATE.EXPIRED ||
                    b.formState === FORM_STATE.COMPLETED
                        ? b.formState - a.formState
                        : a.dueDate - b.dueDate
                }
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
                                (form.formState === formStateTab ||
                                    formStateTab === FORM_STATE.NOTSET)
                            ) {
                                return (
                                    <DataEntryBox
                                        {...form}
                                        /* form.id is not uniqe, assume form.id + faciliyname is */
                                        key={
                                            form.id +
                                            form.instanceNr +
                                            selectedFacility.displayName
                                        }
                                        readOnly={selectedFacility.readOnly}
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
