/* FACILITY AND FORMS */
export const FACILITIES = 'facilities'
export const FORMS = 'forms'

/* DATE AND TIME */
export const MS_IN_A_DAY = 86400000
export const DAYS_IN_A_WEEK = 7
export const DAYS_IN_A_YEAR = 365
export const DAYS_IN_A_MONTH = 30
export const HOURS_IN_A_DAY = 24
export const MINUTES_IN_AN_HOUR = 60
export const SECONDS_IN_AN_HOUR = 3600
export const MS_IN_A_SECONDS = 1000

/* BUSINESS LOGIC */
export const DAILY_INSTANCES = 4
export const WEEKLY_INSTANCES = 4
export const BIWEEKLY_AND_MONTHLY_INSTANCES = 3
export const QUARTERLY_SIX_MONTHLY_AND_YEARLY_INSTANCES = 2
export const UNHANDLED_PERIODTYPE_INSTANCES = 2

export const DAILY = 'Daily'
export const WEEKLY = 'Weekly'
export const WEEKLY_WEDNESDAY = 'WeeklyWednesday'
export const WEEKLY_THURSDAY = 'WeeklyThursday'
export const WEEKLY_SATURDAY = 'WeeklySaturday'
export const WEEKLY_SUNDAY = 'WeeklySunday'
export const BI_WEEKLY = 'BiWeekly'
export const MONTHLY = 'Monthly'
export const BI_MONTHLY = 'BiMonthly'
export const QUARTERLY = 'Quarterly'
export const SIX_MONTHLY = 'SixMonthly'
export const SIX_MONTHLY_APRIL = 'SixMonthlyApril'
export const SIX_MONTHLY_NOVEMBER = 'SixMonthlyNovember'
export const YEARLY = 'Yearly'
export const FINANCIAL_APRIL = 'FinancialApril'
export const FINANCIAL_JULY = 'FinancialJuly'
export const FINANCIAL_OCTOBER = 'FinancialOctober'
export const FINANCIAL_NOVEMBER = 'FinancialNovember'
export const DEFAULT_WARN_PERIODTYPE = periodType =>
    'Unhandled periodType: ' +
    periodType +
    '. Due date was simply set one week ahead.'

/* COLORS */
export const DHIS2_CRITICAL_RED = '#891515'
export const DHIS2_WARNING_YELLOW = '#FFC324'
export const DHIS2_DEFAULT_BLACK = '#212934'
export const DHIS2_SUCCESS_GREEN = '#1B5E20'
export const DHIS2_DISABLED_GRAY = '#A0ADBA'
export const DEFAULT = '#800080' // PURPLE

/* SORTING & SEARCH INFO */
export const FACILITY_SEARCH_PLACEHOLDER = 'Search facility'
export const FORMS_SEARCH_PLACEHOLDER = 'Search forms'

export const SORTING_KEY_NAME = 'displayName'
export const SORTING_KEY_DUE = 'due'

export const FORM_TITLE = 'Form Title'
export const FACILITY_TITLE = 'Facility Title'

export const FORMS_TITLE = 'Forms'
export const DUE_DATE_TITLE = 'Due Date'

export const SEARCHBAR_NAME = 'Search'

export const SORT_ASC = 'asc'
export const SORT_DESC = 'desc'

/* FACILITY CARD */
export const VALUE_OVER_99 = '99+'

/* INTRO TEXT */
export const INTRO_TEXT = 'Choose a facility to get started!'

/* MEDIA QUERIES */
export const MIN_WIDTH_DATAENTRYBOX = '(min-width:870px)'
export const MIN_WIDTH_APP = '(min-width:710px)'
