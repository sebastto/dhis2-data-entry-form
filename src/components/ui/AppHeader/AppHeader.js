import React from 'react'

import './AppHeader.css'
import ReadOnlyIcon from '../../icons/ReadOnlyIcon/ReadOnlyIcon'

const AppHeader = ({ title, subtitle, readOnly }) => (
    <div className="app-header">
        <div className="app-header-text-box">
            <h2 className="app-header-title">{title}</h2>
            <h3 className="app-header-subtitle">
                {subtitle}{' '}
                {readOnly ? (
                    <>
                        - Read Only <ReadOnlyIcon className="read-only-icon" />
                    </>
                ) : (
                    ''
                )}
            </h3>
        </div>
    </div>
)

export default AppHeader
