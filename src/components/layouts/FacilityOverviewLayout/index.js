import React, { useState } from 'react'
import './index.css'
import SortingButtons from '../../ui/SortingButtons'
import SearchBar from '../../ui/SearchBar'
import FacilityCard from '../../ui/FacilityCard'

const FacilityOverviewLayout = ({ hidden, mobileView }) => {
    let containerClassName = 'facility-overview-container'

    if (hidden) {
        containerClassName += ' hidden'
    }

    if (mobileView) {
        containerClassName += ' facility-overview-container-max-width'
    }

    const defaultFacilityCards = [
        {
            title: 'Amsterdam',
            deadlines: { expired: 3, due: 6 },
            onClick: () => {},
        },
        {
            title: 'Istanbul',
            deadlines: { expired: 1, due: 6 },
            onClick: () => {},
        },
        {
            title: 'Budapest',
            deadlines: { expired: 6, due: 6 },
            onClick: () => {},
        },
        {
            title: 'Paris',
            deadlines: { expired: 2, due: 6 },
            onClick: () => {},
        },
        {
            title: 'Ligma',
            deadlines: { expired: 99, due: 101 },
            onClick: () => {},
        },
    ]

    const [searchInput, setSearchInput] = useState('')
    const [facilityCards, setFacilityCards] = useState(defaultFacilityCards)

    const searchOnChange = e => {
        setSearchInput(e.target.value)
    }

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
        <div className="facility-overview-container">
            <h2 className="facility-overview-title">Facilities</h2>
            <SearchBar
                placeholder="Search facility"
                onChange={searchOnChange}
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
            {facilityCards.map((facilityCard, index) => {
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
