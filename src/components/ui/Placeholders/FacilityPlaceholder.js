import React from 'react'
import ContentLoader from 'react-content-loader'

import './FacilityPlaceholder.css'

const FacilityPlaceholder = () => {
    const contentHolder = []
    for (let i = 0; i < 25; i++) {
        contentHolder.push(
            <ContentLoader
                key={i}
                speed={0.5}
                className="facility-placeholder"
                height={80}
            >
                <rect x="0" y="20" rx="4" ry="4" width="65%" height="40%" />
                <circle cx="82%" cy="35" r="7%" />
                <circle cx="94%" cy="35" r="7%" />
            </ContentLoader>
        )
    }

    return (
        <div className="facility-placeholder-container"> {contentHolder} </div>
    )
}

export default FacilityPlaceholder
