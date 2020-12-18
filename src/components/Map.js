import React from 'react';
import * as api from "../api/index";
import LoadingScreen from './LoadingScreen';
import Header from './Header';
import SegmentGroup from './SegmentGroup';
import DataDetailsToolTip from './DataDetailsToolTip';

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mapData: null,
            segmentData: null,
            chronotopeEarliestStartTime: null,
            chronotopeLatestStartTime: null,
            currentDataDetails: null,
            initialAjaxRunning: true
        };
    }

    //Sorts though all the chronotopeData and adds their data to the cooresponding segment that they belong to
    assignChronotopeDataToSegment(segmentData, chronotopeData) {
        chronotopeData.forEach(data => {
            let cooresepondingSegment = segmentData.find(segment => segment.segment_no === data.segment_no);
            
            if(!cooresepondingSegment.chronotopeData)
                cooresepondingSegment.chronotopeData = [];

            cooresepondingSegment.chronotopeData.push(data);
        })
    }

    //Creates an ordered segmentData object per the desired sorting rule
    compileSegmentDataOrderedList(unorderedSegmentData, groupData, chronotopeData, sortingRule) {  
        
        //add cooresponding group data to segmentData
        unorderedSegmentData.forEach(segment => {
            let coorespondingGroup = groupData.find(group => {return segment.group_no === group.group_no})
            
            segment.group_position_no = coorespondingGroup.position;
            segment.group_hex_color = coorespondingGroup.hex_color;
            segment.group_name = coorespondingGroup.name;
        })
        
        const orderedSegmentData = this.sortSegmentData(unorderedSegmentData, sortingRule);
        this.assignChronotopeDataToSegment(orderedSegmentData, chronotopeData)
    
        return orderedSegmentData;
    }

    //loops through chronotope data and records the earliest and latest hit times 
    setChronotopeDataTimeSpan(chronotopeData) {
        let dataEarliestDate = Date.parse(chronotopeData[0].hit_time);
        let dataLastestDate = Date.parse(chronotopeData[0].hit_time);

        chronotopeData.forEach(data => {
            let currentDataHitTime = Date.parse(data.hit_time);

            if(currentDataHitTime < dataEarliestDate) {
                dataEarliestDate = currentDataHitTime;
            }
                
            if(currentDataHitTime > dataLastestDate)
                dataLastestDate = currentDataHitTime;
        })

        this.setState({
            chronotopeEarliestStartTime : dataEarliestDate,
            chronotopeLatestStartTime : dataLastestDate,
        })
    }

    //Sorts Segment Data per the desired sorting rule
    sortSegmentData(segmentData, sortingRule) {
        let sortedData;

        switch(sortingRule) {
            case "group_Asc,segment_Asc":
            default:
                sortedData = segmentData.sort((a,b) => {
                    return ((a.group_position_no - b.group_position_no) || (a.position - b.position))
            })
        }

        return sortedData;
    }
    
    //Fetches all the data and sets state for inital data render
    fetchAndSetInitialMapData(){
        Promise.all([api.fetchMap(),api.fetchSegments(),api.fetchGroups(),api.fetchChronotopeData()]).then(data => {
            const orderedSegmentData = this.compileSegmentDataOrderedList(data[1], data[2], data[3]);
            
            this.setChronotopeDataTimeSpan(data[3]);
            this.setState({
                mapData: data[0],
                segmentData: orderedSegmentData,
                initialAjaxRunning: false
            })
        })
    }
    
    //Compiles data details for the clicked dataPoint and updates the state
    handleShowDataDetails(hitTime, messageId, dataProps) {
        const dataDetails = {
            messageId,
            hitTime,
            segmentName: dataProps.segmentName,
            segmentColor: dataProps.segmentColor,
            groupName: dataProps.groupName,
            groupColor: dataProps.groupColor,
        }

        this.setState({
            currentDataDetails: dataDetails
        })
    }

    componentDidMount() {
        this.fetchAndSetInitialMapData();
    }

    render() {
        return (
        <div className={this.state.initialAjaxRunning? "relative black-background" : "relative white-background-fadeIn"}>
            <LoadingScreen fadeClass={this.state.initialAjaxRunning? "fade-in-opacity" : "fade-out-opacity"}/>
            <Header initialLoadingComplete={!this.state.initialAjaxRunning}/>
            <div id="chronotope-map-section" className={this.state.initialAjaxRunning? "fade-out-opacity" : "fade-in-opacity"}>
                <h1 id="chronotope-map-title">Chronotope Data for {this.state.mapData?.name}</h1>
                <div id="chronotope-map-container">
                    {this.state.segmentData?.map(segment => {
                        return (<SegmentGroup key={segment.id} segmentColor={segment.hex_color} groupColor={segment.group_hex_color} groupName={segment.group_name} segmentName ={segment.name}  
                                    chronotopeData={segment.chronotopeData || null} chronotopeEarliestStartTime={this.state.chronotopeEarliestStartTime} 
                                    chronotopeLatestStartTime={this.state.chronotopeLatestStartTime} currentDataMessageIdShown={this.state.currentDataDetails?.messageId} 
                                    handleShowDataDetails={this.handleShowDataDetails.bind(this)}
                                    />)
                    })}
                </div>
                <DataDetailsToolTip dataDetails={this.state.currentDataDetails}/>
            </div>
        </div>
            )
    }
}

export default Map;