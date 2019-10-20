import React from 'react'
import './index.css'
import FacilityCard from '../../ui/FacilityCard'
import SortingButtons from '../../ui/SortingButtons'
import SearchBar from '../../ui/SearchBar'

const FacilityOverviewLayout = () => {
    return (
        <div className="facility-overview-container">
            <h1>Facilities</h1>
            <SearchBar placeholder="Search facility" onChange={() => {}} />
            <SortingButtons
                labelOne="Facility title"
                labelTwo="Forms"
                onClick={() => {}}
            />
            <FacilityCard
                title={'Amsterdam'}
                deadlines={{ expired: 5, due: 2 }}
                onClick={() => {}}
            />
            <FacilityCard
                title={'Istanbul'}
                deadlines={{ expired: 5, due: 2 }}
                onClick={() => {}}
            />
            <FacilityCard
                title={'Budapest'}
                deadlines={{ expired: 5, due: 2 }}
                onClick={() => {}}
            />
            <FacilityCard
                title={'Paris'}
                deadlines={{ expired: 5, due: 2 }}
                onClick={() => {}}
            />
            <FacilityCard
                title={'Ligma'}
                deadlines={{ expired: 5, due: 2 }}
                onClick={() => {}}
            />
        </div>
    )
}

export default FacilityOverviewLayout
