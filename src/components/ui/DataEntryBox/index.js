import React, { useState, useEffect } from 'react';
//import Spinner from 'react-bootstrap/Spinner'
//import { BrowserRouter, Route, Link } from 'react-router-dom';
import './index.css'
import {Card} from '@dhis2/ui-core'

const DataEntryBox = (props) => {

    //const [noData, setNoData] = useState([true]);
    //const [spinnerAlert, setSpinnerAlert] = useState([false]);
    //const [movieData, setMovieData] = useState([]);
    //let nodata = true;
    //let spinner_alert = false;
    const [title, setTitle] = useState(["Default title"]);
    const [date, setDate] = useState(["22.10"]);
    const [color, setColor] = useState(["red"]);


    useEffect(() => {
       setTitle(props.title);
       setDate(props.date);
       setColor(props.color);
    }, [props]);

    
    //console.log("MOVIEDISPLAYER RENDERING MOVIES");
    //console.log(props.movieData);
    return (
        <Card className="datacard">
            <div className="dataentrybox">
                <div id="colormark" style={{ background: color }}></div>
                <p id="titlebox">{title}</p>
                <p id="datebox">{date}</p>
            </div>
        </Card>
    );
    

}

export default DataEntryBox;