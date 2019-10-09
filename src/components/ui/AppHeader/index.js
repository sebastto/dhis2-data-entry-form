import React from 'React'

import './index.css'

const AppHeader = ({title, subtitle}) => (
    <div className="app-header">
        <h2 className="app-header-title">
            {title}
        </h2>
        <h3 className="app-header-subtitle">
            {subtitle}
        </h3>
    </div>
)

export default AppHeader
