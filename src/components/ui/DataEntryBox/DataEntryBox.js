import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, ButtonStrip, Button } from '@dhis2/ui-core'
import Collapse from '@material-ui/core/Collapse'
import ViewIcon from '../../icons/ViewIcon/ViewIcon'
import EditIcon from '../../icons/EditIcon/EditIcon'

import './DataEntryBox.css'

export const DataEntryBox = ({ title, dueDate, formState }) => {
    const [collapsed, setCollapsed] = useState(false)

    const color = getCardStatusColor(formState)
    const dueString = getDateString(dueDate)

    return (
        <Card className="datacard box-shadow">
            <div className="datacard-colormark" style={{ background: color }} />
            <div
                className="datacard-content"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div className="datacard-content-info">
                    <p className="titlebox">{title}</p>
                    <p className="datebox-due">{dueString && dueString}</p>
                </div>

                <Collapse in={collapsed}>
                    <ButtonStrip middle className="data-card-button-strip">
                        <Button
                            type="button"
                            onClick={() => window.open(props.viewUrl)}
                        >
                            <ViewIcon />
                            <p className="datacard-icon-group-text">View</p>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => window.open(props.editUrl)}
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
    OVERDUE: '#891515', // red
    CLOSEDUE: '#FFC324', // yellow
    NOTCLOSEDUE: 'blue', // blue
    COMPLETED: 'green', // green
    EXPIRED: 'gray', // gray
    //LOCKED: '#212934',    // black
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
    title: PropTypes.string.isRequired,
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
