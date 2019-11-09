import React, { useEffect, useState } from 'react'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import SearchBar from '../../ui/SearchBar/SearchBar'
import FacilityCard from '../../ui/FacilityCard/FacilityCard'

import './FacilityOverviewLayout.css'
import Sorting from '../../../utils/Sorting'

const FacilityOverviewLayout = ({ hidden, mobileView, facilities }) => {
    let containerClassName = 'facility-overview-container'

    if (hidden) {
        containerClassName += ' hidden'
    }

    if (mobileView) {
        containerClassName += ' facility-overview-container-max-width'
    }

    const [searchInput, setSearchInput] = useState('')
    const [facilityCards, setFacilityCards] = useState(null)

    useEffect(() => {
        if (facilities) {
            setFacilityCards(facilities)
        }
    }, [facilities])

    return (
        <div className={containerClassName}>
            <h2 className="facility-overview-title">Facilities</h2>
            <SearchBar
                value={searchInput}
                placeholder="Search facility"
                onChange={event => setSearchInput(event.target.value)}
            />
            <SortingButtons
                firstOption={{
                    key: 'title',
                    title: 'Facility Title',
                }}
                secondOption={{
                    key: 'deadlines.expired',
                    title: 'Forms',
                }}
                onClick={Sorting}
                objectToSet={setFacilityCards}
                prevObject={facilityCards}
                sortingFunc={form => form.deadlines.expired}
            />
            {facilityCards &&
                facilityCards.map((facilityCard, index) => {
                    if (
                        facilityCard.title
                            .toLocaleLowerCase()
                            .startsWith(searchInput.toLocaleLowerCase())
                    )
                        return <FacilityCard key={index} {...facilityCard} />
                })}
        </div>
    )
}

export default FacilityOverviewLayout
