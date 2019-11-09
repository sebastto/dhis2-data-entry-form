import React, { useEffect, useState } from 'react'
import SortingButtons from '../../ui/SortingButtons/SortingButtons'
import SearchBar from '../../ui/SearchBar/SearchBar'
import FacilityCard from '../../ui/FacilityCard/FacilityCard'

import './FacilityOverviewLayout.css'

const FacilityOverviewLayout = ({ hidden, mobileView, facilities }) => {
    let containerClassName = 'facility-overview-container'

    if (mobileView) {
        containerClassName += ' max-width'
    }

    if (hidden) {
        containerClassName += ' hidden-facility'
    }

    const [searchInput, setSearchInput] = useState('')
    const [facilityCards, setFacilityCards] = useState(null)

    useEffect(() => {
        if (facilities) {
            setFacilityCards(facilities)
        }
    }, [facilities])

    const sortOnChange = sortingChoices => {
        const { order, key } = sortingChoices
        switch (key) {
            case 'deadlines.expired':
                if (order === 'asc') {
                    setFacilityCards(
                        [...facilityCards].sort((a, b) => {
                            return a.deadlines.expired - b.deadlines.expired
                        })
                    )
                } else if (order === 'desc') {
                    setFacilityCards(
                        [...facilityCards].sort((a, b) => {
                            return b.deadlines.expired - a.deadlines.expired
                        })
                    )
                }
                break
            case 'title':
                if (order === 'asc') {
                    setFacilityCards(
                        [...facilityCards].sort((a, b) => {
                            return a.title.toLocaleLowerCase() >
                                b.title.toLocaleLowerCase()
                                ? 1
                                : -1
                        })
                    )
                } else if (order === 'desc') {
                    setFacilityCards(
                        [...facilityCards].sort((a, b) => {
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
                onClick={sortOnChange}
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
