import React, { useState, useEffect } from 'react'
import './index.css'
import PropTypes from 'prop-types'
import { Card } from '@dhis2/ui-core'

const DataEntryBox = React.forwardRef((props, setDateInParent) => {
    const [title, setTitle] = useState('ERROR')
    const [date, setDate] = useState(null)
    const [color, setColor] = useState('red')

    useEffect(() => {
        setTitle(props.title)
        if (props.formState === FormState.COMPLETED) {
            setDate('')
            setColor(Warning.COMPLETED)
        } else {
            const dateCalc = calculateDate(props.periodType)
            if (props.formState === FormState.OVERDUE) {
                //Form is overdue. Due-date is now date when timelyDays expires
                //dateCalc = new Date(dateCalc.getDate() + props.timelyDays);
                setColor(Warning.OVERDUE)
            } else if (props.formState === FormState.EXPIRED) {
                //Form is expired. Due-date is now date when expiryDays expires
                //dateCalc = new Date(dateCalc.getDate() + props.timelyDays + props.expiryDays);
                setColor(Warning.EXPIRED)
            } else {
                setColor(calculateColor(dateCalc, props.periodType))
            }
            setDate(dateCalc)
        }

        setDateInParent({ date: date, id: props.formId })
    }, [props])

    return (
        <Card className="datacard">
            <div className="dataentrybox box-shadow" onClick={props.onClick}>
                <div className="colormark" style={{ background: color }} />
                <p className="titlebox">{title}</p>
                <p className="datebox">
                    {date &&
                        date
                            .toLocaleDateString('en-GB', {
                                month: '2-digit',
                                day: '2-digit',
                            })
                            .replace(/\//g, '.')}
                </p>
            </div>
        </Card>
    )
})

export const Warning = {
    OVERDUE: '#891515', // red
    CLOSEDUE: '#FFC324', // yellow
    NOTCLOSEDUE: 'blue', // blue
    COMPLETED: 'green', // green
    EXPIRED: 'gray', // gray
    //LOCKED: '#212934',    // black
}

export const FormState = {
    ACTIVE: 0,
    COMPLETED: 1,
    OVERDUE: 2,
    EXPIRED: 3,
}

DataEntryBox.propTypes = {
    title: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    formState: PropTypes.oneOf(Object.values(FormState)).isRequired,
    formId: PropTypes.number.isRequired,
    //timelyDays: PropTypes.number.isRequired,
    //expiryDays: PropTypes.number.isRequired,
}

const calculateDate = periodType => {
    /*
        Calculates the due-date using periodType.
    */

    let date = new Date()
    const day = date.getDay()
    const month = date.getMonth()

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
            //Set date to sunday this week
            daysToEnd = -day
            if (daysToEnd < 0) daysToEnd += 7
            date.setDate(date.getDate() + daysToEnd)
            break
        case 'Monthly':
            //Set date to last day of month
            date = new Date(date.getFullYear(), month + 1, 0)
            break
        case 'WeeklyWednesday':
            //Set date to tuesday this week
            daysToEnd = 2 - day
            if (daysToEnd < 0) daysToEnd += 7
            //day += daysToEnd;
            date.setDate(date.getDate() + daysToEnd)
            break
        case 'Quarterly':
            //Set date to last date in quarter
            quarter = Math.floor(month / 3) + 1
            quarterMonth = month - (quarter - 1) * 3
            date = new Date(date.getFullYear(), month + 3 - quarterMonth, 0)
            break
        case 'Yearly':
            //Set date to the last day of the year
            date = new Date(date.getFullYear(), 11, 31)
            break
        case 'SixMonthly':
            //Set the day to the last day in the current half-year
            quarter = Math.floor(month / 3) + 1
            quarterMonth = month - (quarter - 1) * 3
            let monthsToHalfYear = 0
            if (quarter == 1 || quarter == 3) {
                monthsToHalfYear += 3
            }
            monthsToHalfYear += 2 - quarterMonth
            date = new Date(date.getFullYear(), month + monthsToHalfYear + 1, 0)
            break

        default:
            console.warn(
                'Unhandled periodType: ' +
                    periodType +
                    '. Due date was simply set one week ahead'
            )
            date.setDate(date.getDate() + 7)
    }
    return date
}

const calculateColor = (date, periodType) => {
    /*
   Calculates an appropriate color using date and periodType.
   Output is either Warning.DUECLOSE or Warning.DUENOTCLOSE.

   If less than 20% of days is remaining and less than 20 days
   is remaining the output is Warning.DUECLOSE.

   If 1 or less days are remaining output is also Warning.DUECLOSE.

   Else the output is Warning.DUENOTCLOSE.

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
        return Warning.CLOSEDUE
    } else {
        return Warning.NOTCLOSEDUE
    }
}

export default DataEntryBox
