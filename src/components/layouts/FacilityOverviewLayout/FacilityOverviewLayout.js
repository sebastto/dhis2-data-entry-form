import React, { useEffect, useState } from 'react'
import classNames from 'classNames'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import FacilityCard from '../../ui/FacilityCard/FacilityCard'
import FacilityPlaceholder from '../../ui/Placeholders/FacilityPlaceholder'
import SearchBar from '../../ui/SearchBar/SearchBar'
import Sorting from '../../../utils/Sorting'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import {
    FACILITY_SEARCH_PLACEHOLDER,
    FACILITY_TITLE,
    FORMS_TITLE,
    SORTING_KEY_DUE,
    SORTING_KEY_NAME,
} from '../../../constants/constants'

import './FacilityOverviewLayout.css'

const FacilityOverviewLayout = ({
    hidden,
    mobileView,
    facilities,
    setSelectedFacility,
    setMobileActiveTab,
}) => {
    const [searchInput, setSearchInput] = useState('')
    const [facilityCards, setFacilityCards] = useState(null)

    const ref = React.createRef()

    const facilitySortingFunction = (a, b) => {
        if (a.deadlines.overDue > b.deadlines.overDue) return 1
        else if (a.deadlines.overDue < b.deadlines.overDue) return -1
        else {
            if (a.deadlines.closeDue > b.deadlines.closeDue) return 1
            else if (a.deadlines.closeDue < b.deadlines.closeDue) return -1
        }
        return 0
    }

    return (
        <div
            className={classNames(
                'facility-overview-container',
                hidden,
                mobileView
            )}
        >
            <h2 className="facility-overview-title">Facilities</h2>
            <SearchBar
                value={searchInput}
                placeholder={FACILITY_SEARCH_PLACEHOLDER}
                onChange={event => setSearchInput(event.target.value)}
            />
            <SortingButtons
                className={'facility-sorting-buttons'}
                firstOption={{
                    key: SORTING_KEY_NAME,
                    title: FACILITY_TITLE,
                }}
                secondOption={{
                    key: SORTING_KEY_DUE,
                    title: FORMS_TITLE,
                    default: true,
                    defaultState: false,
                }}
                onClick={Sorting}
                objectToSet={setFacilityCards}
                prevObject={facilities}
                sortingFunc={facilitySortingFunction}
                ref={ref}
            />
            {facilityCards ? (
                <section className="facility-card-section">
                    <SimpleBar style={{ height: '100%' }} ref={ref}>
                        {facilityCards.map((facilityCard, index) => {
                            if (
                                facilityCard.displayName
                                    .toLocaleLowerCase()
                                    .startsWith(searchInput.toLocaleLowerCase())
                            )
                                return (
                                    <FacilityCard
                                        {...facilityCard}
                                        onClick={() => {
                                            setSelectedFacility(facilityCard)
                                            setMobileActiveTab('forms')
                                            console.log('Set facility:')
                                            console.log(facilityCard)
                                        }}
                                        key={index}
                                    />
                                )
                        })}
                    </SimpleBar>
                </section>
            ) : (
                <FacilityPlaceholder />
            )}
        </div>
    )
}

export default FacilityOverviewLayout
