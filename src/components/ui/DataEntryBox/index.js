import React, { useState, useEffect } from 'react'
import './index.css'
import PropTypes from 'prop-types'
import { Card } from '@dhis2/ui-core'

const DataEntryBox = props => {
    const [title, setTitle] = useState(['ERROR'])
    const [date, setDate] = useState(['ERROR'])
    const [color, setColor] = useState(['red'])

    useEffect(() => {
        setTitle(props.title)
        if (props.completed) {
            setDate('')
            setColor(Warning.COMPLETED)
        } else {
            const date_calc = calculate_date(props.periodType)
            if (props.overdue) {
                //Form is overdue. Due-date is now date when timelyDays expires
                //date_calc = new Date(date_calc.getDate() + props.timelyDays);
                setColor(Warning.OVERDUE)
            } else if (props.expired) {
                //Form is expired. Due-date is now date when expiryDays expires
                //date_calc = new Date(date_calc.getDate() + props.timelyDays + props.expiryDays);
                setColor(Warning.EXPIRED)
            } else {
                setColor(calculate_color(date_calc, props.periodType))
            }
            const day = ('00' + date_calc.getDate()).substr(-2, 2)
            const month = ('00' + (date_calc.getMonth() + 1)).substr(-2, 2)
            setDate(day + '.' + month)
        }
    }, [props])

    return (
        <Card className="datacard">
            <div className="dataentrybox box-shadow" onClick={props.clickprop}>
                <div className="colormark" style={{ background: color }} />
                <p className="titlebox">{title}</p>
                <p className="datebox">{date}</p>
            </div>
        </Card>
    )
}

export const Warning = {
    OVERDUE: '#891515', // red
    CLOSEDUE: '#FFC324', // yellow
    NOTCLOSEDUE: 'blue', // blue
    COMPLETED: 'green', // green
    EXPIRED: 'gray', // gray
    //LOCKED: '#212934',    // black
}

DataEntryBox.propTypes = {
    title: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    overdue: PropTypes.bool.isRequired,
    expired: PropTypes.bool.isRequired,
    //timelyDays: PropTypes.number.isRequired,
    //expiryDays: PropTypes.number.isRequired,
}

const calculate_date = periodType => {
    /*
        Calculates the due-date using periodType.
    */

    let date = new Date()
    const day = date.getDay()
    const month = date.getMonth()

    //Early Variable declaration (compiler work-around)
    let days_to_end = -1
    let quarter = -1
    let quartermonth = -1

    switch (periodType) {
        /*
        Implemented to match these specs:
        https://github.com/dhis2/dhis2-core/tree/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/period
        */
        case 'Weekly':
            //Set date to sunday this week
            days_to_end = -day
            if (days_to_end < 0) days_to_end += 7
            date.setDate(date.getDate() + days_to_end)
            break
        case 'Monthly':
            //Set date to last day of month
            date = new Date(date.getFullYear(), month + 1, 0)
            break
        case 'WeeklyWednesday':
            //Set date to tuesday this week
            days_to_end = 2 - day
            if (days_to_end < 0) days_to_end += 7
            //day += days_to_end;
            date.setDate(date.getDate() + days_to_end)
            break
        case 'Quarterly':
            //Set date to last date in quarter
            quarter = Math.floor(month / 3) + 1
            quartermonth = month - (quarter - 1) * 3
            date = new Date(date.getFullYear(), month + 3 - quartermonth, 0)
            break
        case 'Yearly':
            //Set date to the last day of the year
            date = new Date(date.getFullYear(), 11, 31)
            break
        case 'SixMonthly':
            //Set the day to the last day in the current half-year
            quarter = Math.floor(month / 3) + 1
            quartermonth = month - (quarter - 1) * 3
            let months_to_halfyear = 0
            if (quarter == 1 || quarter == 3) {
                months_to_halfyear += 3
            }
            months_to_halfyear += 2 - quartermonth
            date = new Date(
                date.getFullYear(),
                month + months_to_halfyear + 1,
                0
            )
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

const calculate_color = (date, periodType) => {
    /*
   Calculates an appropriate color using date and periodType.
   Output is either Warning.DUECLOSE or Warning.DUENOTCLOSE.

   If less than 20% of days is remaining and less than 20 days
   is remaining the output is Warning.DUECLOSE.

   If 1 or less days are remaining output is also Warning.DUECLOSE.

   Else the output is Warning.DUENOTCLOSE.

*/

    const today = new Date()
    const days_to_deadline = (date - today) / (1000 * 3600 * 24)
    let full_days_to_deadline = -1
    switch (periodType) {
        case 'Weekly':
            full_days_to_deadline = 7
            break
        case 'Monthly':
            full_days_to_deadline = 30
            break
        case 'WeeklyWednesday':
            full_days_to_deadline = 7
            break
        case 'Quarterly':
            full_days_to_deadline = 365 / 4
            break
        case 'Yearly':
            full_days_to_deadline = 365
            break
        case 'SixMontly':
            full_days_to_deadline = 365 / 2
            break
        default:
            full_days_to_deadline = 30
    }

    if (
        (days_to_deadline / full_days_to_deadline < 0.2 &&
            days_to_deadline < 20) ||
        days_to_deadline <= 1
    ) {
        return Warning.CLOSEDUE
    } else {
        return Warning.NOTCLOSEDUE
    }
}

export default DataEntryBox
