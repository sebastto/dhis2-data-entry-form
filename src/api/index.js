import { useDataQuery } from '@dhis2/app-runtime'
import { useCallback } from 'react'

const organisationUnits = {
    myData: {
        resource: 'me',
        id: '?fields=organisationUnits[displayName,id]',
    },
}
const viewOrganisationIds = {
    myData: {
        resource: 'me',
        id: '?fields=dataViewOrganisationUnits',
    },
}
const dataSets = {
    myData: {
        resource: 'me',
        id:
            '?fields=organisationUnits[id,displayName,dataSets[id,displayName,periodType,openFuturePeriods]]',
    },
}
const completeForms = {
    myData: {
        resource: 'completeDataSetRegistrations',
        id: ({ organisationId, dataSetId, period }) =>
            `?orgUnit=${organisationId}&dataSet=${dataSetId}&period=${period}`,
    },
}

//Get all organisations the user has RW acces to
export const getOrganisation = callback => {
    const { error, data } = useDataQuery(organisationUnits, {
        onComplete: useCallback(data => {
            callback(data.myData.organisationUnits)
        }, []),
    })
    {
        error && `ERROR: ${error.message}`
    }
    if (data && data.myData) {
        return data.myData.organisationUnits.map(ou => ou.id)
    }
}
//Get all organisations the user has only R acces to
export const getViewOrganisationIds = () => {
    const { error, data } = useDataQuery(viewOrganisationIds)
    {
        error && `ERROR: ${error.message}`
    }
    if (data && data.myData) {
        return data.myData.dataViewOrganisationUnits.map(ou => ou.id)
    }
}

//Get all relevant data from a dataSet by their id, contains displayName, shortDisplayName, periodType, openFuturePeriods
export const getDataSets = callback => {
    const { error, data } = useDataQuery(dataSets, {
        onComplete: useCallback(data => {
            const organiations = {}
            data.myData.organisationUnits.forEach(unit => {
                const datasets = unit.dataSets.map(dataset => {
                    return {
                        id: dataset.id,
                        title: dataset.displayName,
                        periodType: dataset.periodType,
                        openFuturePeriods: dataset.openFuturePeriods,
                    }
                })
                organiations[unit.displayName] = datasets
            })
            callback(organiations)
        }, []),
    })

    {
        error && `ERROR: ${error.message}`
    }
    if (data && data.myData) {
        return data.myData
    }
}
//Get a list of completed dataSets in a given ogranisation in selected period
/**
 * period can be defined as follows:
 * 2004W5; week 5, 2004.
 * 2004WedW5; wednsday week 5, 2004.
 * 2004BiW1; week 1-2, 2004.
 * 200403; March(month3) 2004.
 * 2004Q1; January-March(first quarter) 2004.
 * 2004S1; January-June(half-year) 2004. 2004; 2004
 *
 */
export const getCompleteForm = (organisationId, dataSetId, period) => {
    const { error, data } = useDataQuery(completeForms, {
        variables: {
            organisationId,
            dataSetId,
            period,
        },
    })

    {
        error && `ERROR: ${error.message}`
    }
    if (data && data.myData) {
        return data.myData
    }
}
