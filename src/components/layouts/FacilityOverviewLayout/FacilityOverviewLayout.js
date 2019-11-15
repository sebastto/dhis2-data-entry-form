import React, { useEffect, useState } from 'react'
import classNames from 'classNames'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import reactRouterDom from 'react-router-dom'
const { useHistory } = reactRouterDom

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
import LevelSwitch from '../../ui/LevelSwitch/LevelSwitch'

const FacilityOverviewLayout = ({
    hidden,
    mobileView,
    facilities,
    selectedFacility,
    setSelectedFacility,
    setMobileActiveTab,
}) => {
    const history = useHistory()
    const [searchInput, setSearchInput] = useState('')
    const [childSwitch, setChildSwitch] = useState(false)
    const [facilityCards, setFacilityCards] = useState(null)
    const [hideFacilities, setHideFacilities] = useState(false)

    const ref = React.createRef()

    useEffect(() => {
        if (facilities) {
            setFacilityCards(facilities)
            if (facilities.length === 1) {
                setHideFacilities(true)
                setSelectedFacility(facilities[0])
            }
        }
    }, [facilities])

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
        !hideFacilities && (
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
                <LevelSwitch value={childSwitch} onChange={setChildSwitch} />
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
                    sortingFuncConditionalReverse={facilitySortingFunction}
                    ref={ref}
                />
                {facilityCards ? (
                    (facilityCards.length > 1 || mobileView) && (
                        <section className="facility-card-section">
                            <SimpleBar style={{ height: '100%' }} ref={ref}>
                                {facilityCards.map((facilityCard, index) => {
                                    if (
                                        facilityCard.displayName
                                            .toLocaleLowerCase()
                                            .startsWith(
                                                searchInput.toLocaleLowerCase()
                                            ) &&
                                        ((!childSwitch &&
                                            facilityCard.parent) ||
                                            childSwitch)
                                    )
                                        return (
                                            <FacilityCard
                                                {...facilityCard}
                                                onClick={() => {
                                                    setSelectedFacility(
                                                        facilityCard
                                                    )
                                                    setMobileActiveTab('forms')
                                                    history.push(
                                                        `/${facilityCard.displayName}`
                                                    )
                                                }}
                                                selected={
                                                    selectedFacility
                                                        ? facilityCard ===
                                                          selectedFacility
                                                        : false
                                                }
                                                key={index}
                                            />
                                        )
                                })}
                            </SimpleBar>
                        </section>
                    )
                ) : (
                    <FacilityPlaceholder />
                )}
            </div>
        )
    )
}

export default FacilityOverviewLayout
