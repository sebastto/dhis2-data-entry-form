import React, { useState } from 'react'
import { Button, ButtonStrip, Card } from '@dhis2/ui-core'
import Collapse from 'react-css-collapse'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import EditIcon from '../../icons/EditIcon/EditIcon'
import ExpandIcon from '../../icons/ExpandIcon/ExpandIcon'
import ViewIcon from '../../icons/ViewIcon/ViewIcon'
import useMedia from '../../../utils/Media'
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
    readOnly,
}) => {
    const [collapsed, setCollapsed] = useState(false)
    const color = getCardStatusColor(formState)
    const mobileView = !useMedia(MIN_WIDTH_DATAENTRYBOX)

    const dueDateString = getDateString(dueDate)

    // Text that will be displayed in top level of data entry box
    let dateBoxDueText = dueDateString
    let expandedModeShowDueDate = false

    if (formState === FORM_STATE.COMPLETED) {
        dateBoxDueText = 'Completed'
        expandedModeShowDueDate = true
    } else if (formState === FORM_STATE.EXPIRED) {
        dateBoxDueText = 'Expired'
        expandedModeShowDueDate = true
    }

    return (
        <Card className="datacard box-shadow">
            <div className="datacard-colormark" style={{ background: color }} />
            <div
                className="datacard-content"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div className="datacard-content-info">
                    <p className="titlebox">{displayName}</p>
                    {!collapsed && !mobileView && (
                        <div className="url-buttons">
                            <Button
                                className={'card-button'}
                                type="button"
                                onClick={() => window.open(viewUrl)}
                            >
                                <ViewIcon className="url-buttons-icons" />
                                <p className="datacard-icon-group-text">View</p>
                            </Button>
                            <Button
                                type="button"
                                onClick={() => window.open(editUrl)}
                                className={classNames('card-button', {
                                    hidden: readOnly,
                                })}
                            >
                                <EditIcon className="url-buttons-icons" />
                                <p className="datacard-icon-group-text">Edit</p>
                            </Button>
                        </div>
                    )}
                    <p
                        className={classNames('datebox-due', {
                            'datebox-mobile': mobileView,
                        })}
                    >
                        {dateBoxDueText}
                    </p>
                    <div className="icon-holder">
                        <ExpandIcon
                            className={
                                !collapsed
                                    ? 'expand-icon'
                                    : 'expand-icon expand-icon-collapse'
                            }
                        />
                    </div>
                </div>

                <Collapse isOpen={collapsed}>
                    {expandedModeShowDueDate && (
                        <p>Form was due {dueDateString}</p>
                    )}
                    <p>Period type: {periodType}</p>
                    <p>
                        Expiration date (will close at):{' '}
                        {expiryDate !== -1
                            ? getDateString(expiryDate)
                            : 'Never'}
                    </p>
                    <ButtonStrip middle className="data-card-button-strip">
                        <Button
                            type="button"
                            onClick={() => window.open(viewUrl)}
                            icon={<ViewIcon />}
                        >
                            View
                        </Button>

                        <Button
                            type="button"
                            onClick={() => window.open(editUrl)}
                            icon={<EditIcon />}
                            className={classNames({ hidden: readOnly })}
                        >
                            Edit
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
    readOnly: PropTypes.bool,
}

DataEntryBox.defaultProps = {
    viewUrl:
        process.env.REACT_APP_DHIS2_BASE_URL +
        process.env.REACT_APP_DHIS2_FORM_VIEW_URL,
    editUrl:
        process.env.REACT_APP_DHIS2_BASE_URL +
        process.env.REACT_APP_DHIS2_FORM_EDIT_URL,
    readOnly: false,
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
    return date
        .toLocaleDateString('en-GB', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/\//g, '.')
}

export default DataEntryBox
