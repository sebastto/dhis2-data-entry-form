import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, ButtonStrip, Button } from '@dhis2/ui-core'
import Collapse from '@material-ui/core/Collapse'
import ViewIcon from '../../icons/ViewIcon/ViewIcon'
import EditIcon from '../../icons/EditIcon/EditIcon'
import ExpandIcon from '../../icons/ExpandIcon/ExpandIcon'
import ShrinkIcon from '../../icons/ShrinkIcon/ShrinkIcon'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { MIN_WIDTH_DATAENTRYBOX } from '../../../constants/constants'
import { FORM_STATE, STATUS_COLORS } from '../../../constants/enums'

import './DataEntryBox.css'

export const DataEntryBox = ({
    displayName,
    dueDate,
    formState,
    viewUrl,
    editUrl,
    periodType,
    expiryDate,
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const color = getCardStatusColor(formState)
    const dueString = getDateString(dueDate)
    const mobileView = !useMediaQuery(MIN_WIDTH_DATAENTRYBOX)

    return (
        <Card className="datacard box-shadow">
            <div className="datacard-colormark" style={{ background: color }} />
            <div
                className="datacard-content"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div className="datacard-content-info">
                    <p
                        className="titlebox"
                        style={{ borderRight: !mobileView ? 0 : '1px solid' }}
                    >
                        {displayName}
                    </p>
                    {!collapsed && !mobileView && (
                        <div className="url-buttons">
                            <Button
                                className={'card-button'}
                                type="button"
                                onClick={() => window.open(viewUrl)}
                            >
                                <ViewIcon className="expand-icon" />
                                <p>View</p>
                            </Button>
                            <Button
                                className={'card-button'}
                                type="button"
                                visibility="hidden"
                                onClick={() => window.open(editUrl)}
                            >
                                <EditIcon />
                                <p>Edit</p>
                            </Button>
                        </div>
                    )}
                    <p className="datebox-due">{dueString && dueString}</p>
                    <div className="icon-holder">
                        {!collapsed ? <ExpandIcon /> : <ShrinkIcon />}
                    </div>
                </div>

                <Collapse in={collapsed}>
                    <p>Period type: {periodType}</p>
                    <p>
                        Expiration date (will close at):{' '}
                        {expiryDate != -1 ? getDateString(expiryDate) : 'Never'}
                    </p>
                    <ButtonStrip middle className="data-card-button-strip">
                        <Button
                            type="button"
                            onClick={() => window.open(viewUrl)}
                        >
                            <ViewIcon />
                            <p className="datacard-icon-group-text">View</p>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => window.open(editUrl)}
                        >
                            <EditIcon />
                            <p className="datacard-icon-group-text">Edit</p>
                        </Button>
                    </ButtonStrip>
                </Collapse>
            </div>
        </Card>
    )
}

DataEntryBox.propTypes = {
    displayName: PropTypes.string.isRequired,
    dueDate: PropTypes.instanceOf(Date),
    formState: PropTypes.oneOf(Object.values(FORM_STATE)),
    viewUrl: PropTypes.string,
    editUrl: PropTypes.string,
}

DataEntryBox.defaultProps = {
    viewUrl:
        process.env.REACT_APP_DHIS2_BASE_URL +
        process.env.REACT_APP_DHIS2_FORM_VIEW_URL,
    editUrl:
        process.env.REACT_APP_DHIS2_BASE_URL +
        process.env.REACT_APP_DHIS2_FORM_EDIT_URL,
}

const getCardStatusColor = formState => {
    switch (formState) {
        case FORM_STATE.NOTCLOSEDUE:
            return STATUS_COLORS.NOTCLOSEDUE
        case FORM_STATE.CLOSEDUE:
            return STATUS_COLORS.CLOSEDUE
        case FORM_STATE.OVERDUE:
            return STATUS_COLORS.OVERDUE
        case FORM_STATE.COMPLETED:
            return STATUS_COLORS.COMPLETED
        case FORM_STATE.EXPIRED:
            return STATUS_COLORS.EXPIRED
        default:
            return STATUS_COLORS.DEFAULT
    }
}

const getDateString = date => {
    const dateString = date
        .toLocaleDateString('en-GB', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/\//g, '.')

    return dateString
}

export default DataEntryBox
