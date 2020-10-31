import React, { Component } from 'react';
import {clearAuth,avgFilter} from '../actions/pages';


class DateSelector extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            startDate:'',
            endDate:'',
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
        }
        else{
            this.props.dispatch(updateTransactionFailure("Please select both the Filters first !!!!"))
        }
        //clear msgs shown to the user
        setTimeout(() => {
            this.props.dispatch(clearAuth());
        }, 10000);
        console.log(this.state.endDate.split('-'));
        console.log(this.state.startDate.split('-'));  
    };
    render() {
        return (
            <div>
                Start Date  &nbsp;&nbsp;
                <input type="date" onChange={this.handleChange} placeholder="Start Date" style={{width:"200px",fontSize:"15px"}}/>&nbsp;&nbsp;
                End Date   &nbsp;&nbsp;
                <input type="date" onChange={this.handleChange2} placeholder="End Date" style={{width:"200px",fontSize:"15px"}}/>&nbsp;&nbsp;
                <button style={{width:"50px",fontSize:"15px"}} onClick={this.handleApply}>Apply</button>
            </div>
        );
    }
}

export default DateSelector;