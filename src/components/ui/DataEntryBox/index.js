import React, { useState, useEffect } from 'react'
import './index.css'
import PropTypes from 'prop-types'
import { Card } from '@dhis2/ui-core'
import Collapse from '@material-ui/core/Collapse'
import ViewIcon from '../../icons/ViewIcon'
import EditIcon from '../../icons/EditIcon'

const DataEntryBox = props => {
    const [title, setTitle] = useState(['ERROR'])
    const [date, setDate] = useState(['ERROR'])
    const [color, setColor] = useState(['red'])
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        setTitle(props.title)
        setDate(props.date)
        setColor(props.color)
    }, [props])

    return (
        <Card className="datacard box-shadow">
            <div className="datacard-colormark" style={{ background: color }} />
            <div
                className="datacard-content"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div className="datacard-content-info">
                    <p className="titlebox">{title}</p>
                    <p className="datebox">{date}</p>
                </div>

                <Collapse in={collapsed}>
                    <div className="data-card-action-container">
                        <div className="datacard-icon-group">
                            <ViewIcon />
                            <p className="datacard-icon-group-text">View</p>
                        </div>

                        <div className="datacard-icon-group">
                            <EditIcon />
                            <p className="datacard-icon-group-text">Edit</p>
                        </div>
                    </div>
                </Collapse>
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
