import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

import AppHeader from './components/ui/AppHeader'
import DataEntryBox from './components/ui/DataEntryBox'

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <>
        <AppHeader title="Form overview" subtitle="Bum Kaku MCHP" />
        <div className="container">
            <style jsx>{`
            .container {
                position: absolute;
                top: 48px;
                bottom: 0px;
                left: 0px;
                right: 0px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
            }
        }`}</style>
            <DataQuery query={query}>
                {({ error, loading, data }) => {
                    if (error) return <span>ERROR</span>
                    if (loading) return <span>...</span>
                    return (
                        <>
                            <h1>
                                {i18n.t('Hello {{name}}', { name: data.me.name })}
                            </h1>
                            <h3>{i18n.t('Welcome to DHIS2!')}</h3>
                            <DataEntryBox title="Child Health" date="24.11" color="blue" clickprop={() => console.log("forward to Data Entry with form_id")}></DataEntryBox>
                            <DataEntryBox title="A Very very very very very very very very very very very very long form" date="31.12" color="red" clickprop={() => console.log("forward to Data Entry with form_id")}></DataEntryBox>
                        </>
                    )
                }}
            </DataQuery>
        </div>
    </>
)

export default MyApp
