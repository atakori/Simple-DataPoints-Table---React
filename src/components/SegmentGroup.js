import React, { useState } from 'react';

//Renders each segment row and its cooresponding chronotope data 
const SegmentGroup = (props) => {
    const [currentlyHovered, setHover] = useState(false);
    
    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="segment" style={{color: '#' + props.segmentColor, borderBottom: currentlyHovered? "1px solid #" + props.groupColor: "", borderTop: currentlyHovered? "1px solid #" + props.groupColor: ""}}>
            <p className="segment-group-column" style={{backgroundColor: '#' + props.groupColor, color: '#' + props.groupColor}}>|</p>
            <p className="segment-name">{props.segmentName}</p>
            <div className= "chronotope-data-container">
                {props.chronotopeData?.map(dataPoint => {
                    return (
                        <div key={dataPoint.message_id} className={"chronotope-data " + (props.currentDataMessageIdShown === dataPoint.message_id? "highlight-node": "")} style={{left: calculateChronotopeDataPositionPercent(dataPoint.hit_time, props)}} 
                        onClick={()=> props.handleShowDataDetails(dataPoint.hit_time, dataPoint.message_id, props)} > 
                            <span className="flex"><span className="chronotope-node no-margin" style={{backgroundColor: '#' + props.segmentColor}}></span></span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
} 

//calculates the position of each rendered segment data point
function calculateChronotopeDataPositionPercent(currentHitTime, props) {
    let percentage = (((Date.parse(currentHitTime) - props.chronotopeEarliestStartTime) / (props.chronotopeLatestStartTime - props.chronotopeEarliestStartTime)) * 100);
    return percentage.toString() + '%';
}

export default SegmentGroup;
