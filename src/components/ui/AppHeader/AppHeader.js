import React from 'react'

import './AppHeader.css'

const AppHeader = ({ displayName, subtitle }) => (
    <div className="app-header">
        <h2 className="app-header-title">{displayName}</h2>
        <h3 className="app-header-subtitle">{subtitle}</h3>
    </div>
)

export default AppHeader
