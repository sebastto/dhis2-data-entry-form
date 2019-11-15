import { useDataQuery } from '@dhis2/app-runtime'

import { TextFormatter } from '../utils/Formatter'

const organisations = {
    userData: {
        resource: 'me',
        id: '?fields=organisationUnits[id],dataViewOrganisationUnits[id]',
    },
}
const allChildOrganisationUnits = {
    childOrganisations: {
        resource: 'organisationUnits',
        id: ({ orgID }) =>
            `?fields=displayName,id,dataSets[id,displayName,periodType,openFuturePeriods,timelyDays,expiryDays]&paging=false&filter=path:like:${orgID}`,
    },
}
const completeForms = {
    myData: {
        resource: 'completeDataSetRegistrations',
        id: ({ startDate, endDate, organisationId, dataSetId }) =>
            `?startDate=${startDate}&endDate=${endDate}${organisationId}${dataSetId}`,
    },
}

// Gets all organisations that this user belong to
export const getAllOrganisationData = async engine => {
    try {
        const orgList = []
        const { userData } = await engine.query(organisations)

        for (const parent of userData.organisationUnits) {
            const { childOrganisations } = await engine.query(
                allChildOrganisationUnits,
                {
                    variables: {
                        orgID: parent.id,
                    },
                }
            )
            childOrganisations.organisationUnits.forEach(unit => {
                unit['displayName'] = TextFormatter(unit['displayName'])
                unit['readOnly'] = false
                unit['parent'] = parent.id === unit.id

                orgList.push(unit)
            })
        }

        for (const viewUnit of userData.dataViewOrganisationUnits) {
            const { childOrganisations } = await engine.query(
                allChildOrganisationUnits,
                {
                    variables: {
                        orgID: viewUnit.id,
                    },
                }
            )
            childOrganisations.organisationUnits.forEach(unit => {
                unit['displayName'] = TextFormatter(unit['displayName'])
                unit['readOnly'] = true
                unit['parent'] = viewUnit.id === unit.id

                orgList.push(unit)
            })
        }
        return { organisations: orgList }
    } catch (e) {
        console.error('Error @ getAllOrganisationData: ', e)
        throw e
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
export const getCompleteForm = async (dataSets, engine) => {
    try {
        const allMyData = { completeDataSetRegistrations: [] }

        // Divide large requests into smaller chunks to avoid network error
        while (dataSets.organisationIds.length > 0) {
            const currentOrganisationIds = dataSets.organisationIds.splice(
                0,
                220
            )

            const queryParams = {
                startDate: dataSets.startDate,
                endDate: dataSets.endDate,
                organisationId: '',
                dataSetId: '',
            }

            for (const dataSetId of dataSets.dataSetIds) {
                queryParams.dataSetId += `&dataSet=${dataSetId}`
            }

            for (const organisationId of currentOrganisationIds) {
                queryParams.organisationId += `&orgUnit=${organisationId}`
            }

            const { myData } = await engine.query(completeForms, {
                variables: queryParams,
            })

            if (myData && myData.completeDataSetRegistrations) {
                allMyData.completeDataSetRegistrations.push(
                    ...myData.completeDataSetRegistrations
                )
            }
        }

        return allMyData
    } catch (e) {
        console.error('Error @ getCompleteForm: ', e)
        throw e
    }
}
