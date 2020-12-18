import React from 'react';

//Renders the specific details depending on what chronotope dataPoint is selected 
    //Child Component of Map.js

const DataDetailsToolTip = (props) => {
    return (
        <div id="toolTip-container">
            {renderDetailsText(props)}
        </div>
    )
}

function renderDetailsText(props) {
    if(!props.dataDetails)
        return (<div className="center-text full-width">
                    <p className="center-text">Click a DataPoint above to view more details</p>
                </div>)
    else
        return(<div id="toolTip-details-inner-container">
                    <p>Hit Time: {props.dataDetails.hitTime}</p>
                    <p>Cluster: <span style={{color: '#'+ props.dataDetails.segmentColor}}>{props.dataDetails.segmentName}</span></p>
                    <p>Group: <span style={{color: '#'+ props.dataDetails.groupColor}}>{props.dataDetails.groupName}</span></p>
                </div>
        )
}

export default DataDetailsToolTip;