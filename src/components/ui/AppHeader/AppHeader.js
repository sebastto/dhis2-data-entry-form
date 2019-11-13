import React from 'react'

import './AppHeader.css'

const AppHeader = ({ title, subtitle }) => (
    <div className="app-header">
        <div className="app-header-text-box">
            <h2 className="app-header-title">{title}</h2>
            <h3 className="app-header-subtitle">{subtitle}</h3>
        </div>
    </div>
)

export default AppHeader
