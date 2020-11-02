import React, { Component } from 'react';
import {connect} from "react-redux";
//actions
import {clearAuth,avgFilter,updateTransactionFailure} from '../actions/pages';
//components
import GraphPiechart2 from './GraphPiechart2';
import GraphLinechart2 from './GraphLinechart2';
import GraphBargraph2 from './GraphBargraph2';



class DateSelector extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            startDate:'',
            endDate:'',
            show:null
        }
    }
    handleChange = (e) => {
        this.setState({
            startDate:e.target.value
        })
    };
    handleChange2 = (e) => {
        this.setState({
            endDate:e.target.value
        })
    };
    handleApply = () => {
        const {startDate,endDate} = this.state;
        if(startDate !=='' && endDate!=='')
        {
            this.props.dispatch(avgFilter(startDate.split('-'),endDate.split('-')));
            this.setState({show:true})
        }
        else{
            this.props.dispatch(updateTransactionFailure("Please select both the Filters first !!!!"))
        }
        //clear msgs shown to the user
        setTimeout(() => {
            this.props.dispatch(clearAuth());
        }, 10000);
        //console.log(this.state.endDate.split('-'));
        //console.log(this.state.startDate.split('-'));  
    };
    render() {
        const {show} = this.state;
        const { piechart,linechart, bargraph,week,month} = this.props.details;
        console.log("@@@@@@@@#######",week,month);

        return (
            <div>
                Start Date  &nbsp;&nbsp;
                <input type="date" onChange={this.handleChange} placeholder="Start Date" style={{width:"200px",fontSize:"15px"}}/>&nbsp;&nbsp;
                End Date   &nbsp;&nbsp;
                <input type="date" onChange={this.handleChange2} placeholder="End Date" style={{width:"200px",fontSize:"15px"}}/>&nbsp;&nbsp;
                <button style={{width:"50px",fontSize:"15px"}} onClick={this.handleApply}>Apply</button>
                <br></br>
                {(linechart && show) && <GraphLinechart2
                monday={week.Monday}
                tuesday={week.Tuesday}
                wednesday={week.Wednesday}
                thursday={week.Thursday}
                friday={week.Friday}
                saturday={week.Saturday}
                sunday={week.Sunday}
                january={month.January}
                february={month.February}
                march={month.March}
                april={month.April}
                may={month.May}
                june={month.June}
                july={month.July}
                august={month.August}
                september={month.September}
                october={month.October}
                november={month.November}
                december={month.December}
                />}
                {( piechart && show) && <GraphPiechart2
                 monday={week.Monday}
                 tuesday={week.Tuesday}
                 wednesday={week.Wednesday}
                 thursday={week.Thursday}
                 friday={week.Friday}
                 saturday={week.Saturday}
                 sundy={week.Sunday}
                 january={month.January}
                 february={month.February}
                 march={month.March}
                 april={month.April}
                 may={month.May}
                 june={month.June}
                 july={month.July}
                 august={month.August}
                 september={month.September}
                 october={month.October}
                 november={month.November}
                 december={month.December}
                />}
                {(bargraph && show) && <GraphBargraph2
                 monday={week.Monday}
                 tuesday={week.Tuesday}
                 wednesday={week.Wednesday}
                 thursday={week.Thursday}
                 friday={week.Friday}
                 saturday={week.Saturday}
                 sundy={week.Sunday}
                 january={month.January}
                 february={month.February}
                 march={month.March}
                 april={month.April}
                 may={month.May}
                 june={month.June}
                 july={month.July}
                 august={month.August}
                 september={month.September}
                 october={month.October}
                 november={month.November}
                 december={month.December}
                />}
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        auth: state.auth,
        details: state.details,
    };
}

export default connect(mapStateToProps)(DateSelector);