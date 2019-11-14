import { useDataQuery } from '@dhis2/app-runtime'
import { TextFormatter } from '../utils/Formatter'

const organisations = {
    userData: {
        resource: 'me',
        id:
            '?fields=organisationUnits[displayName,id],dataViewOrganisationUnits[name~rename(displayName),id]',
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
        id: ({ organisationId, dataSetId, period }) =>
            `?orgUnit=${organisationId}&dataSet=${dataSetId}&period=${period}`,
    },
}

// Gets all organisations that this user belong to
export const getAllOrganisationData = async engine => {
    const orgList = []
    const { userData } = await engine.query(organisations)

    for (const unit of userData.organisationUnits) {
        const { childOrganisations } = await engine.query(
            allChildOrganisationUnits,
            {
                variables: {
                    orgID: unit.id,
                },
            }
        )
        childOrganisations.organisationUnits.forEach(unit => {
            unit['displayName'] = TextFormatter(unit['displayName'])
            unit['readOnly'] = false

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

            orgList.push(unit)
        })
    }
    return { organisations: orgList }
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
