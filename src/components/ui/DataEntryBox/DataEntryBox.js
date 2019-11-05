import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, ButtonStrip, Button } from '@dhis2/ui-core'
import Collapse from '@material-ui/core/Collapse'
import ViewIcon from '../../icons/ViewIcon/ViewIcon'
import EditIcon from '../../icons/EditIcon/EditIcon'

import './DataEntryBox.css'

const DataEntryBox = React.forwardRef((props, setDateInParent) => {
    const [title, setTitle] = useState('ERROR')
    const [dateDue, setDateDue] = useState(null)
    const [dateExpiration, setDateExpiration] = useState(null)
    const [color, setColor] = useState('red')
    const [formState, setFormState] = useState(FormState.NOTSET) // for sorting in tabs
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        setTitle(props.title)
        const dateArray = getPeriodStartAndEnd(props.periodType)
        /*console.log("datar 0 ==" + dateArray[0].toLocaleDateString('en-GB', {
            month: '2-digit',
            day: '2-digit',
        })
            .replace(/\//g, '.'))

        console.log("datar 1 ==" + dateArray[1].toLocaleDateString('en-GB', {
            month: '2-digit',
            day: '2-digit',
        })
            .replace(/\//g, '.'))

        console.log("timelyDays =="+props.timelyDays)
        console.log("expiryDays ==" +props.expiryDays)
        console.log("periodType=="+props.periodType)
        */
        dateArray[0].setDate(dateArray[0].getDate() + props.timelyDays)
        dateArray[1].setDate(
            dateArray[1].getDate() + props.timelyDays + props.expiryDays
        )

        setDateDue(dateArray[0])
        if (props.expiryDays == 0) {
            //form will never expire.
            setDateExpiration('Never')
        } else {
            setDateExpiration(dateArray[1])
        }
        /*console.log("deadline ==" + dateArray[0].toLocaleDateString('en-GB', {
            month: '2-digit',
            day: '2-digit',
        })
            .replace(/\//g, '.'))

        console.log("expiration ==" + dateArray[1].toLocaleDateString('en-GB', {
            month: '2-digit',
            day: '2-digit',
        })
            .replace(/\//g, '.'))
        */

        const today = new Date()
        if (props.formState === FormState.COMPLETED) {
            setFormState(FormState.COMPLETED)
            setColor(Status.COMPLETED)
        } else if (dateArray[1] < today) {
            setFormState(FormState.EXPIRED)
            setColor(Status.EXPIRED)
        } else if (dateArray[0] < today) {
            setFormState(FormState.OVERDUE)
            setColor(Status.OVERDUE)
        } else {
            //Form is "active": Either DUENOTCLOSE or DUECLOSE
            const cc = calculateColor(dateArray[0], props.periodType)
            setColor(cc)
            if (cc === Status.NOTCLOSEDUE) {
                setFormState(FormState.NOTCLOSEDUE)
            } else if (cc === Status.CLOSEDUE) {
                setFormState(FormState.CLOSEDUE)
            } else {
                console.warn(
                    'Critical logic error in DataEntryBox. calculateColor bad return'
                )
            }
        }
        /*
        console.log(props.title + " has dateDue==" + dateArray[0].toLocaleDateString('en-GB', {
            month: '2-digit',
            day: '2-digit',
        })
            .replace(/\//g, '.') + ". Periodtype was "+props.periodType)
        */
    }, [props])

    useEffect(() => {
        setDateInParent({ dateDue: dateDue, id: props.formId })
    }, [dateDue])

    let dueString = dateDue
    let expirationString = dateExpiration
    if (
        dateDue != null &&
        (typeof dateDue != 'string' || !dateDue instanceof String)
    ) {
        dueString = dateDue
            .toLocaleDateString('en-GB', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
            })
            .replace(/\//g, '.')
    }
    if (
        dateExpiration != null &&
        (typeof dateExpiration != 'string' || !dateExpiration instanceof String)
    ) {
        expirationString = dateExpiration
            .toLocaleDateString('en-GB', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
            })
            .replace(/\//g, '.')
    }

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
                    <p className="datebox-expiration">
                        {expirationString && expirationString}
                    </p>
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
})

export const Status = {
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
    viewUrl: PropTypes.string,
    editUrl: PropTypes.string,
    periodType: PropTypes.string.isRequired,
    formState: PropTypes.oneOf(Object.values(FormState)),
    formId: PropTypes.number.isRequired,
    timelyDays: PropTypes.number.isRequired,
    expiryDays: PropTypes.number.isRequired,
}

DataEntryBox.defaultProps = {
    viewUrl: '#',
    editUrl: '#',
}

const getPeriodStartAndEnd = periodType => {
    let dateEnd = new Date() // set to today temporary
    let dateStart = new Date() // set to today temporary
    const day = dateEnd.getDay()
    const month = dateEnd.getMonth()

    //Early Variable declaration (compiler work-around)
    let daysToEnd = -1
    let quarter = -1
    let quarterMonth = -1

    switch (periodType) {
        /*
        Implemented to match these specs:
        https://github.com/dhis2/dhis2-core/tree/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/period
        */
        case 'Weekly':
            //Sets dateEnd to sunday this week. Sets dateStart to monday this week.
            daysToEnd = -day
            if (daysToEnd < 0) daysToEnd += 7
            dateEnd.setDate(dateEnd.getDate() + daysToEnd)
            dateStart.setDate(dateEnd.getDate() - 6)
            break
        case 'Monthly':
            //Sets dateEnd to last day of month. Sets dateStart to first day of month
            dateEnd = new Date(dateEnd.getFullYear(), month + 1, 0)
            dateStart = new Date(dateEnd.getFullYear(), month, 1)
            break
        case 'WeeklyWednesday':
            //Set dateEnd to tuesday this week. Sets dateStart to wednesday this week
            daysToEnd = 2 - day
            if (daysToEnd < 0) daysToEnd += 7
            //day += daysToEnd;
            dateEnd.setDate(dateEnd.getDate() + daysToEnd)
            dateStart.setDate(dateEnd.getDate() - 6)
            break
        case 'Quarterly':
            //Set dateEnd to last date in quarter. Sets dateStart to first date in quarter.
            quarter = Math.floor(month / 3) + 1
            quarterMonth = month - (quarter - 1) * 3
            dateEnd = new Date(
                dateEnd.getFullYear(),
                month + 3 - quarterMonth,
                0
            )
            dateStart = new Date(dateEnd.getFullYear(), month - quarterMonth, 1)
            break
        case 'Yearly':
            //Set dateEnd to the last day of the year. Sets dateStart to the first day of the year
            dateEnd = new Date(dateEnd.getFullYear(), 11, 31)
            dateStart = new Date(dateEnd.getFullYear(), 0, 1)
            break
        case 'SixMonthly':
            //Sets dateEnd to the last day in the current half-year. Sets dateStart to first.
            quarter = Math.floor(month / 3) + 1
            quarterMonth = month - (quarter - 1) * 3
            let monthsToHalfYear = 0
            if (quarter == 1 || quarter == 3) {
                monthsToHalfYear += 3
            }
            monthsToHalfYear += 2 - quarterMonth
            dateEnd = new Date(
                dateEnd.getFullYear(),
                month + monthsToHalfYear + 1,
                0
            )
            dateStart = new Date(
                dateEnd.getFullYear(),
                dateEnd.getMonth() - 6,
                1
            )
            break

        default:
            console.warn(
                'Unhandled periodType: ' +
                    periodType +
                    '. Due date was simply set one week ahead'
            )
            dateEnd.setDate(dateEnd.getDate() + 7)
            dateStart.setDate(dateEnd.getDate() + -7)
    }
    return [dateStart, dateEnd]
}

const calculateColor = (date, periodType) => {
    /*
   Calculates an appropriate color using date and periodType.
   Output is either Status.DUECLOSE or Status.DUENOTCLOSE.

   If less than 20% of days is remaining and less than 20 days
   is remaining the output is Status.DUECLOSE.

   If 1 or less days are remaining output is also Status.DUECLOSE.

   Else the output is Status.DUENOTCLOSE.

*/

    const today = new Date()
    const daysToDeadLine = (date - today) / (1000 * 3600 * 24)
    let fullDaysToDeadLine = -1
    switch (periodType) {
        case 'Weekly':
            fullDaysToDeadLine = 7
            break
        case 'Monthly':
            fullDaysToDeadLine = 30
            break
        case 'WeeklyWednesday':
            fullDaysToDeadLine = 7
            break
        case 'Quarterly':
            fullDaysToDeadLine = 365 / 4
            break
        case 'Yearly':
            fullDaysToDeadLine = 365
            break
        case 'SixMontly':
            fullDaysToDeadLine = 365 / 2
            break
        default:
            fullDaysToDeadLine = 30
    }

    if (
        (daysToDeadLine / fullDaysToDeadLine < 0.2 && daysToDeadLine < 20) ||
        daysToDeadLine <= 1
    ) {
        return Status.CLOSEDUE
    } else {
        return Status.NOTCLOSEDUE
    }
}

export default DataEntryBox
