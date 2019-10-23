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

        const [searchInput, setSearchInput] = useState('')

        const facilityCards = [
            {
                title: 'Amsterdam',
                deadlines: {expired: 5, due: 2},
                onClick: () => {
                },
            },
            {
                title: 'Istanbul',
                deadlines: {expired: 5, due: 2},
                onClick: () => {
                },
            },
            {
                title: 'Budapest',
                deadlines: {expired: 5, due: 2},
                onClick: () => {
                },
            },
            {
                title: 'Paris',
                deadlines: {expired: 5, due: 2},
                onClick: () => {
                },
            },
            {
                title: 'Ligma',
                deadlines: {expired: 5, due: 2},
                onClick: () => {
                },
            },
        ]

        const myOnChange = e => {
            setSearchInput(e.target.value)
        }

        return (
            <div className={containerClassName}>
                <h2 className="facility-overview-title">Facilities</h2>
                <SearchBar placeholder="Search facility" onChange={myOnChange}/>
                <SortingButtons
                    labelOne="Facility title"
                    labelTwo="Forms"
                    onClick={() => {
                    }}
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
}

export default FacilityOverviewLayout
