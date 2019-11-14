import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, ButtonStrip, Button } from '@dhis2/ui-core'
import Collapse from '@material-ui/core/Collapse'
import ViewIcon from '../../icons/ViewIcon/ViewIcon'
import EditIcon from '../../icons/EditIcon/EditIcon'
import ExpandIcon from '../../icons/ExpandIcon/ExpandIcon'
import ShrinkIcon from '../../icons/ShrinkIcon/ShrinkIcon'
import useMediaQuery from '@material-ui/core/useMediaQuery'

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
    const mobileView = !useMediaQuery('(min-width:870px)')

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
                        {!collapsed ? (
                            <ExpandIcon className={'expand-icon'} />
                        ) : (
                            <ShrinkIcon className={'shrink-icon'} />
                        )}
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

const StatusColors = {
    OVERDUE: '#891515', // dhis2 critical red
    CLOSEDUE: '#FFC324', // dhis2 warning yellow
    NOTCLOSEDUE: '#212934', // dhis2 default black
    COMPLETED: '#1b5e20', // dhis2 success green
    EXPIRED: '#a0adba', // dhis2 disabled gray
}

export const FormState = {
    //ACTIVE: 0,
    NOTSET: -1,
    NOTCLOSEDUE: 0,
    CLOSEDUE: 1,
    OVERDUE: 2,
    COMPLETED: 3,
    EXPIRED: 4,
}

DataEntryBox.propTypes = {
    displayName: PropTypes.string.isRequired,
    dueDate: PropTypes.instanceOf(Date),
    formState: PropTypes.oneOf(Object.values(FormState)),
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
        case FormState.NOTCLOSEDUE:
            return StatusColors.NOTCLOSEDUE
        case FormState.CLOSEDUE:
            return StatusColors.CLOSEDUE
        case FormState.OVERDUE:
            return StatusColors.OVERDUE
        case FormState.COMPLETED:
            return StatusColors.COMPLETED
        case FormState.EXPIRED:
            return StatusColors.EXPIRED
        default:
            return 'purple'
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
