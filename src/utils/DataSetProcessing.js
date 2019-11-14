import { TextFormatter } from './Formatter'
import {
    BI_MONTHLY,
    BI_WEEKLY,
    DAYS_IN_A_MONTH,
    DAYS_IN_A_WEEK,
    DAYS_IN_A_YEAR,
    DEFAULT_WARN_PERIODTYPE,
    FINANCIAL_APRIL,
    FINANCIAL_JULY,
    FINANCIAL_NOVEMBER,
    FINANCIAL_OCTOBER,
    HOURS_IN_A_DAY,
    MINUTES_IN_AN_HOUR,
    MONTHLY,
    MS_IN_A_DAY,
    QUARTERLY,
    SECONDS_IN_AN_HOUR,
    SIX_MONTHLY,
    SIX_MONTHLY_APRIL,
    SIX_MONTHLY_NOVEMBER,
    WEEKLY,
    WEEKLY_SATURDAY,
    WEEKLY_SUNDAY,
    WEEKLY_THURSDAY,
    WEEKLY_WEDNESDAY,
    YEARLY,
} from '../constants/constants'
import { FORM_STATE } from '../constants/enums'

export const processDataSets = organisations => {
    for (const index in organisations) {
        const holder = []
        const deadlines = {
            closeDue: 0,
            overDue: 0,
        }
        const facilityDataSets = organisations[index].dataSets

        for (let i = 0; i < facilityDataSets.length; i++) {
            const dataSet = facilityDataSets[i]
            const deadlineInfo = getFormDeadlineInfo(dataSet)
            for (let j = 0; j < deadlineInfo.formDates.dueDates.length; j++) {
                if (deadlineInfo.formStates[j] === FORM_STATE.CLOSEDUE) {
                    deadlines.closeDue += 1
                } else if (deadlineInfo.formStates[j] === FORM_STATE.OVERDUE) {
                    deadlines.overDue += 1
                }
                holder.push({
                    id: dataSet.id,
                    displayName: TextFormatter(dataSet.displayName),
                    dueDate: deadlineInfo.formDates.dueDates[j],
                    formState: deadlineInfo.formStates[j],
                    instanceNr: j.toString(),
                    periodType: dataSet.periodType,
                    expiryDate: deadlineInfo.formDates.expiryDates[j],
                })
            }
        }
        organisations[index].dataSets = holder.slice()
        organisations[index].deadlines = deadlines
    }
    return organisations
}

const getFormDeadlineInfo = dataSet => {
    const formDates = getFormDates(dataSet)
    const todaysDate = new Date()
    // TODO: check api for completed form
    const formCompleted = false

    // Set the forms state
    let formState = undefined
    const formStates = []

    for (let i = 0; i < formDates.dueDates.length; i++) {
        if (formCompleted) {
            formState = FORM_STATE.COMPLETED
        } else if (
            formDates.expiryDates[i] !== -1 &&
            todaysDate > formDates.expiryDates[i]
        ) {
            formState = FORM_STATE.EXPIRED
        } else if (todaysDate > formDates.dueDates[i]) {
            formState = FORM_STATE.OVERDUE
        } else {
            formState = getFormStateUrgency(
                todaysDate,
                formDates.dueDates[i],
                dataSet.periodType[0]
            )
        }
        formStates.push(formState)
    }

    return { formDates, formStates }
}

const getFormDates = dataSet => {
    let periodEnd = new Date() // set to today temporary
    let periodStart = new Date() // set to today temporary
    const day = periodEnd.getDay()
    const month = periodEnd.getMonth()
    const periodEnds = []
    const periodStarts = []

    //Early Variable declaration (compiler work-around)
    let daysToEnd = -1
    let quarter = -1
    let quarterMonth = -1
    let shift = -1

    switch (dataSet.periodType) {
        /*
        Implemented to match these specs:
        https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/period/PeriodType.java        */
        case WEEKLY:
            if (shift === -1) shift = 0
        case WEEKLY_WEDNESDAY:
            if (shift === -1) shift = 2
        case WEEKLY_THURSDAY:
            if (shift === -1) shift = 3
        case WEEKLY_SATURDAY:
            if (shift === -1) shift = 5
        case WEEKLY_SUNDAY:
            if (shift === -1) shift = 6
            daysToEnd = shift - day
            if (daysToEnd < 0) daysToEnd += DAYS_IN_A_WEEK
            periodEnd.setDate(periodEnd.getDate() + daysToEnd)
            periodStart = new Date(
                periodEnd.getTime() -
                    6 *
                        HOURS_IN_A_DAY *
                        MINUTES_IN_AN_HOUR *
                        MINUTES_IN_AN_HOUR *
                        1000
            )

            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 4; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd = new Date(
                    periodEnd.setDate(periodEnd.getDate() - DAYS_IN_A_WEEK)
                )
                periodEnd.setHours(23, 59, 59, 999)
                periodStart = new Date(
                    periodStart.setDate(periodStart.getDate() - 7)
                )
            }
            break
        case BI_WEEKLY:
            //Finds the current week number
            const januaryFirst = new Date(periodEnd.getFullYear(), 0, 1)
            const week = Math.ceil(
                ((periodEnd - januaryFirst) / MS_IN_A_DAY +
                    januaryFirst.getDay() -
                    1) /
                    DAYS_IN_A_WEEK
            )
            if (week % 2) {
                daysToEnd = -day + DAYS_IN_A_WEEK * 2
            } else {
                daysToEnd = -day + DAYS_IN_A_WEEK
            }
            if (day === 0) daysToEnd -= DAYS_IN_A_WEEK
            periodEnd.setDate(periodEnd.getDate() + daysToEnd)
            periodStart = new Date(
                periodEnd.getTime() -
                    6.5 *
                        HOURS_IN_A_DAY *
                        MINUTES_IN_AN_HOUR *
                        MINUTES_IN_AN_HOUR *
                        1000 *
                        2
            )

            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 3; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd = new Date(
                    periodEnd.setDate(periodEnd.getDate() - DAYS_IN_A_WEEK * 2)
                )
                periodEnd.setHours(23, 59, 59, 999)
                periodStart = new Date(
                    periodStart.setDate(
                        periodStart.getDate() - DAYS_IN_A_WEEK * 2
                    )
                )
            }
            break
        case MONTHLY:
            //Sets periodEnd to last day of month. Sets periodStart to first day of month
            periodEnd = new Date(periodEnd.getFullYear(), month + 1, 0)
            periodStart = new Date(periodEnd.getFullYear(), month, 1)
            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 3; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd = new Date(
                    periodEnd.getFullYear(),
                    periodEnd.getMonth(),
                    0
                )
                periodEnd.setHours(23, 59, 59, 999)
                periodStart = new Date(
                    periodStart.getFullYear(),
                    periodStart.getMonth() - 1,
                    1
                )
            }
            break
        case BI_MONTHLY:
            //Sets periodEnd to last day of every even month. Sets periodStart to first day of month
            if (month % 2) {
                shift = 1
            } else {
                shift = 2
            }
            periodStart = new Date(
                periodEnd.getFullYear(),
                month + shift - 2,
                1
            )
            periodEnd = new Date(periodStart.getFullYear(), month + shift, 0)
            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 3; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd = new Date(
                    periodEnd.getFullYear(),
                    periodEnd.getMonth() - 2,
                    0
                )
                periodEnd.setHours(23, 59, 59, 999)
                periodStart = new Date(
                    periodStart.getFullYear(),
                    periodStart.getMonth() - 2,
                    1
                )
            }
            break
        case QUARTERLY:
            //Set periodEnd to last date in quarter. Sets periodStart to first date in quarter.
            quarter = Math.floor(month / 3) + 1
            quarterMonth = month - (quarter - 1) * 3
            periodEnd = new Date(
                periodEnd.getFullYear(),
                month + 3 - quarterMonth,
                0
            )
            periodStart = new Date(
                periodEnd.getFullYear(),
                month - quarterMonth,
                1
            )
            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 2; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd.setMonth(periodEnd.getMonth() - 3)
                periodEnd.setHours(23, 59, 59, 999)
                periodStart.setMonth(periodStart.getMonth() - 3)
            }
            break
        case SIX_MONTHLY:
            if (shift === -1) shift = 1
        case SIX_MONTHLY_APRIL:
            if (shift === -1) shift = 4
        case SIX_MONTHLY_NOVEMBER:
            if (shift === -1) shift = 11
            //Set periodEnd to last date in quarter. Sets periodStart to first date in quarter.
            let half = 0
            if (shift - month < -4 || (shift - month > 1 && shift - month < 8))
                half = 1
            periodEnd = new Date(
                periodEnd.getFullYear(),
                shift + (half + 1) * 6 - 1,
                0
            )
            periodStart = new Date(
                periodStart.getFullYear(),
                shift + half * 6 - 1,
                1
            )
            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 2; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd.setDate(20)
                periodEnd = new Date(
                    periodEnd.getFullYear(),
                    periodEnd.getMonth() - 5,
                    0
                )
                periodEnd.setHours(23, 59, 59, 999)
                periodStart = new Date(
                    periodStart.getFullYear(),
                    periodStart.getMonth() - 6,
                    1
                )
            }
            break
        case YEARLY:
            if (shift === -1) shift = 0
        case FINANCIAL_APRIL:
            if (shift === -1) shift = 3
        case FINANCIAL_JULY:
            if (shift === -1) shift = 6
        case FINANCIAL_OCTOBER:
            if (shift === -1) shift = 9
        case FINANCIAL_NOVEMBER:
            if (shift === -1) shift = 10
            //Set periodEnd to the last day of the year. Sets periodStart to the first day of the year
            periodEnd = new Date(periodEnd.getFullYear(), shift + 12, 0)
            periodStart = new Date(periodStart.getFullYear(), shift, 1)
            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 2; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd.setFullYear(periodEnd.getFullYear() - 1)
                periodEnd.setHours(23, 59, 59, 999)
                periodStart.setFullYear(periodStart.getFullYear() - 1)
            }
            break
        default:
            console.warn(DEFAULT_WARN_PERIODTYPE(dataSet.periodType))
            periodEnd.setDate(periodEnd.getDate() + 7)
            periodStart.setDate(periodEnd.getDate() + -7)
            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(23, 59, 59, 999)
            for (let i = 0; i < 2; i++) {
                periodEnds.push(new Date(periodEnd))
                periodStarts.push(new Date(periodStart))
                periodEnd = new Date(
                    periodEnd.getTime() -
                        DAYS_IN_A_WEEK *
                            HOURS_IN_A_DAY *
                            MINUTES_IN_AN_HOUR *
                            MINUTES_IN_AN_HOUR *
                            1000
                )
                periodStart = new Date(
                    periodEnd.getTime() -
                        DAYS_IN_A_WEEK *
                            HOURS_IN_A_DAY *
                            MINUTES_IN_AN_HOUR *
                            MINUTES_IN_AN_HOUR *
                            1000
                )
            }
    }

    const dueDates = []
    for (let i = 0; i < periodStarts.length; i++) {
        dueDates.push(
            new Date(
                periodStarts[i].getTime() +
                    dataSet.timelyDays *
                        HOURS_IN_A_DAY *
                        MINUTES_IN_AN_HOUR *
                        MINUTES_IN_AN_HOUR *
                        1000
            )
        )
    }

    const expiryDates = []
    for (let i = 0; i < periodStarts.length; i++) {
        expiryDates.push(
            dataSet.expiryDays !== 0
                ? new Date(
                      periodEnds[i].getTime() +
                          (dataSet.timelyDays + dataSet.expiryDays) *
                              HOURS_IN_A_DAY *
                              MINUTES_IN_AN_HOUR *
                              MINUTES_IN_AN_HOUR *
                              1000
                  )
                : -1
        )
    }
    return { periodStarts, periodEnds, dueDates, expiryDates }
}

const getFormStateUrgency = (todaysDate, dueDate, periodType) => {
    const daysToDeadLine =
        (dueDate - todaysDate) / (1000 * SECONDS_IN_AN_HOUR * HOURS_IN_A_DAY)
    let fullDaysToDeadLine = -1

    switch (periodType) {
        case WEEKLY:
            fullDaysToDeadLine = DAYS_IN_A_WEEK
            break
        case MONTHLY:
            fullDaysToDeadLine = DAYS_IN_A_MONTH
            break
        case WEEKLY_WEDNESDAY:
            fullDaysToDeadLine = DAYS_IN_A_WEEK
            break
        case QUARTERLY:
            fullDaysToDeadLine = DAYS_IN_A_YEAR / 4
            break
        case YEARLY:
            fullDaysToDeadLine = DAYS_IN_A_YEAR
            break
        case SIX_MONTHLY:
            fullDaysToDeadLine = DAYS_IN_A_YEAR / 2
            break
        default:
            fullDaysToDeadLine = DAYS_IN_A_MONTH
    }

    if (
        (daysToDeadLine / fullDaysToDeadLine < 0.2 && daysToDeadLine < 20) ||
        daysToDeadLine <= 1
    ) {
        return FORM_STATE.CLOSEDUE
    } else {
        return FORM_STATE.NOTCLOSEDUE
    }
}
