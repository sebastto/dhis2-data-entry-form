/* DATAENTRYBOX ENUMS */
export const STATUS_COLORS = {
    OVERDUE: '#891515', // dhis2 critical red
    CLOSEDUE: '#FFC324', // dhis2 warning yellow
    NOTCLOSEDUE: '#212934', // dhis2 default black
    COMPLETED: '#1b5e20', // dhis2 success green
    EXPIRED: '#a0adba', // dhis2 disabled gray
    DEFAULT: 'purple',
}

export const FORM_STATE = {
    //ACTIVE: 0,
    NOTSET: -1,
    NOTCLOSEDUE: 0,
    CLOSEDUE: 1,
    OVERDUE: 2,
    COMPLETED: 3,
    EXPIRED: 4,
}
