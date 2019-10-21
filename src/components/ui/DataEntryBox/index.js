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
        setDate(props.date)
        setColor(props.color)
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
    DUE: '#FFC324',
    EXPIRED: '#891515',
    LOCKED: '#212934',
}

DataEntryBox.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    color: PropTypes.oneOf(Object.values(Warning)).isRequired,
}

export default DataEntryBox
