import React, { Component } from 'react';
import {connect} from "react-redux";

class DetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            amount:'',
            type:''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange.bind(this);
        this.handleChange3 = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      handleChange(event) {
        this.setState({category: event.target.value});
      }
      handleChange2(event) {
        this.setState({amount: event.target.value2});
      }

      handleChange3(event) {
        this.setState({type: event.target.value3});
      }
    
      handleSubmit() {
        //call dispatch
      }
      
    render() {
        const {success,error} = this.props.details;
        return (
            <div className="form-box">
                <h2>ADD DETAILS</h2><br></br>
                {error && (
                    <div className="alert-warn">
                        <button>{error}</button>
                    </div>
                        )}
                {success && (
                    <div className="alert-done">
                        <button>Transaction Added Successfully</button>
                    </div>
                )}
                <div>
                    <label>Chose Category</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <select value={this.state.value} onChange={this.handleChange} placeholder="Category">
                        <option value="Income">Income</option>
                        <option value="Housing">Housing</option>
                        <option value="Food">Food</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Recreation">Recreation</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                </div><br></br>
                <div>
                    <label>Enter Amount</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" value2={this.state.value2} onChange={this.handleChange2} placeholder="00.00" required/>
                </div><br></br>
                <div>
                    <label>Chose Type</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <select value3={this.state.value3} onChange={this.handleChange3} placeholder="Type">
                        <option value3="Credit">Credit</option>
                        <option value3="Debit">Debit</option>
                    </select>
                </div><br></br><br></br>
                <button className="add" onClick={this.handleSubmit}>ADD</button>
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

export default connect(mapStateToProps)(DetailsPage);