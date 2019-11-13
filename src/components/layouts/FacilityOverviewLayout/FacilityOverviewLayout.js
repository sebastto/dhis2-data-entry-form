import React, { useEffect, useState } from 'react'
import classNames from 'classNames'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import SearchBar from '../../ui/SearchBar/SearchBar'
import FacilityCard from '../../ui/FacilityCard/FacilityCard'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import FacilityPlaceholder from '../../ui/Placeholders/FacilityPlaceholder'

import './FacilityOverviewLayout.css'
import Sorting from '../../../utils/Sorting'

const FacilityOverviewLayout = ({
    hidden,
    mobileView,
    facilities,
    setSelectedFacility,
    setMobileActiveTab,
}) => {
    const [searchInput, setSearchInput] = useState('')
    const [facilityCards, setFacilityCards] = useState(null)

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
                placeholder="Search facility"
                onChange={event => setSearchInput(event.target.value)}
            />
            <SortingButtons
                className={'facility-sorting-buttons'}
                firstOption={{
                    key: 'displayName',
                    title: 'Facility Title',
                }}
                secondOption={{
                    key: 'due',
                    title: 'Forms',
                    default: true,
                    defaultState: false,
                }}
                onClick={Sorting}
                objectToSet={setFacilityCards}
                prevObject={facilities}
                sortingFunc={facilitySortingFunction}
            />
            {facilityCards ? (
                <section className="facility-card-section">
                    <SimpleBar style={{ height: '100%' }}>
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
