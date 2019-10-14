import React, { useState, useEffect } from 'react';
import './index.css'
import {Card} from '@dhis2/ui-core'

const DataEntryBox = (props) => {

    const [title, setTitle] = useState(["ERROR"]);
    const [date, setDate] = useState(["ERROR"]);
    const [color, setColor] = useState(["red"]);


    useEffect(() => {
       setTitle(props.title);
       setDate(props.date);
       setColor(props.color);
    }, [props]);

    
    return (
        <Card className="datacard">
            <div className="dataentrybox box-shadow" onClick={props.clickprop}>
                <div className="colormark" style={{ background: color }}></div>
                <p className="titlebox">{title}</p>
                <p className="datebox">{date}</p>
            </div>
        </Card>
    );
    

}

export default DataEntryBox;