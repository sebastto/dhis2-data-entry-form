import { FormState } from '../components/ui/DataEntryBox/DataEntryBox'

export const processDataSets = dataSets => {
    const processedDataSets = {}

    for (const key in dataSets) {
        const facilityDataSets = dataSets[key]

        processedDataSets[key] = facilityDataSets.map(dataSet => {
            const deadlineInfo = getFormDeadlineInfo(dataSet)
            return {
                id: dataSet.id,
                displayName: dataSet.displayName,
                dueDate: deadlineInfo.formDates.dueDate,
                formState: deadlineInfo.formState,
                periodType: dataSet.periodType,
                expiryDate: deadlineInfo.formDates.expiryDate,
            }
        })
    }

    return processedDataSets
}

const getFormDeadlineInfo = dataSet => {
    const formDates = getFormDates(dataSet)

    const todaysDate = new Date()

    // TODO: check api for completed form
    const formCompleted = false

    // Set the forms state
    let formState = undefined

    if (formCompleted) {
        formState = FormState.COMPLETED
    } else if (
        formDates.expiryDate !== -1 &&
        todaysDate > formDates.expiryDate
    ) {
        formState = FormState.EXPIRED
    } else if (todaysDate > formDates.dueDate) {
        formState = FormState.OVERDUE
    } else {
        formState = getFormStateUrgency(
            todaysDate,
            formDates.dueDate,
            dataSet.periodType
        )
    }

    return { formDates, formState }
}

const getFormDates = dataSet => {
    let periodEnd = new Date() // set to today temporary
    let periodStart = new Date() // set to today temporary
    const day = periodEnd.getDay()
    const month = periodEnd.getMonth()

    //Early Variable declaration (compiler work-around)
    let daysToEnd = -1
    let quarter = -1
    let quarterMonth = -1
    let shift = -1

    switch (dataSet.periodType) {
        /*
        Implemented to match these specs:
        https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/period/PeriodType.java        */
        case 'Weekly':
            if (shift == -1) shift = 0
        case 'WeeklyWednesday':
            if (shift == -1) shift = 2
        case 'WeeklyThursday':
            if (shift == -1) shift = 3
        case 'WeeklySaturday':
            if (shift == -1) shift = 5
        case 'WeeklySunday':
            if (shift == -1) shift = 6
            daysToEnd = shift - day
            if (daysToEnd < 0) daysToEnd += 7
            periodEnd.setDate(periodEnd.getDate() + daysToEnd)
            periodStart = new Date(
                periodEnd.getTime() - 6 * 24 * 60 * 60 * 1000
            )
            break
        case 'BiWeekly':
            //Finds the current week number
            const januaryFirst = new Date(periodEnd.getFullYear(), 0, 1)
            const week = Math.ceil(
                ((periodEnd - januaryFirst) / 86400000 +
                    januaryFirst.getDay() -
                    1) /
                    7
            )
            if (week % 2) {
                daysToEnd = -day + 14
            } else {
                daysToEnd = -day + 7
            }
            if (day == 0) daysToEnd -= 7
            periodEnd.setDate(periodEnd.getDate() + daysToEnd)
            periodStart = new Date(
                periodEnd.getTime() - 6.5 * 24 * 60 * 60 * 1000 * 2
            )
            break
        case 'Monthly':
            //Sets dateEnd to last day of month. Sets dateStart to first day of month
            periodEnd = new Date(periodEnd.getFullYear(), month + 1, 0)
            periodStart = new Date(periodEnd.getFullYear(), month, 1)
            break
        case 'BiMonthly':
            //Sets dateEnd to last day of every even month. Sets dateStart to first day of month
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
            break
        case 'Quarterly':
            //Set dateEnd to last date in quarter. Sets dateStart to first date in quarter.
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
            break
        case 'SixMonthly':
            if (shift == -1) shift = 1
        case 'SixMonthlyApril':
            if (shift == -1) shift = 4
        case 'SixMonthlyNovember':
            if (shift == -1) shift = 11
            //Set dateEnd to last date in quarter. Sets dateStart to first date in quarter.
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
            break
        case 'Yearly':
            if (shift == -1) shift = 0
        case 'FinancialApril':
            if (shift == -1) shift = 3
        case 'FinancialJuly':
            if (shift == -1) shift = 6
        case 'FinancialOctober':
            if (shift == -1) shift = 9
        case 'FinancialNovember':
            if (shift == -1) shift = 10
            //Set dateEnd to the last day of the year. Sets dateStart to the first day of the year
            periodEnd = new Date(periodEnd.getFullYear(), shift + 12, 0)
            periodStart = new Date(periodStart.getFullYear(), shift, 1)
            break
        default:
            console.warn(
                'Unhandled periodType: ' +
                    dataSet.periodType +
                    '. Due date was simply set one week ahead'
            )
            periodEnd.setDate(periodEnd.getDate() + 7)
            periodStart.setDate(periodEnd.getDate() + -7)
    }

    periodStart.setHours(0, 0, 0, 0)
    periodEnd.setHours(23, 59, 59, 999)

    const dueDate = new Date(
        periodStart.getTime() + dataSet.timelyDays * 24 * 60 * 60 * 1000
    )
    const expiryDate =
        dataSet.expiryDays != 0
            ? new Date(
                  periodEnd.getTime() +
                      (dataSet.timelyDays + dataSet.expiryDays) *
                          24 *
                          60 *
                          60 *
                          1000
              )
            : -1

    return { periodStart, periodEnd, dueDate, expiryDate }
}

const getFormStateUrgency = (todaysDate, dueDate, periodType) => {
    const daysToDeadLine = (dueDate - todaysDate) / (1000 * 3600 * 24)
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
        return FormState.CLOSEDUE
    } else {
        return FormState.NOTCLOSEDUE
    }
}
