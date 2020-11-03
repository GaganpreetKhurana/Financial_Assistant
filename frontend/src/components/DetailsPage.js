import React, {Component} from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
//actions
import {addTransaction, clearAuth} from "../actions/pages";


class DetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '0',
            amount: '',
            type: 'true',
            description: '',
            dummy: null,
            type2:'false'
        };
    }
    //functions to handle different input fields
    handleChange = (event) => {
        this.setState({category: event.target.value});
    }
    handleChange2 = (event) => {
        this.setState({amount: event.target.value});
    }
    handleChange3 = (event) => {
        this.setState({type: event.target.value});
    }
    handleChange4 = (event) => {
        this.setState({description: event.target.value});
    }


    handleSubmit = (e) => {
        //call dispatch
        e.preventDefault();
        var {category, type, description, amount} = this.state;
        if(category!=='Income' && category !== 'Other')
        {
            type = this.state.type2;
        }
        this.props.dispatch(addTransaction(category, type, description, amount));
        //to clear the dispayed msgs
        setTimeout(() => {
            this.props.dispatch(clearAuth());
        }, 10000);

        this.setState({
            category: '0',
            amount: '',
            type: 'true',
            description: '',
            dummy: null,
            type2:'false'
        });

    }
    //clear msgs when the component unmounts
    componentWillUnmount() {
        this.props.dispatch(clearAuth());
    }

    render() {
        const {success, error, inProgress} = this.props.details;
        const {isLoggedIn} = this.props.auth;
        //so that only logged in user sees this page
        if (!isLoggedIn) {
            return <Redirect to="/login"/>;
        }
        return (
            <div className="form-box">
                <h2>ADD DETAILS</h2><br/>
                {error && (
                    <div className="alert-warn">
                        <button>{error}</button>
                    </div>
                )}
                {success && (
                    <div className="alert-done">
                        <button>{success}</button>
                    </div>
                )}
                <div>
                    <label>Choose Category</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <select onChange={this.handleChange} value={this.state.category} placeholder="Category">
                        <option value="0">Income</option>
                        <option value="1">Housing</option>
                        <option value="2">Food</option>
                        <option value="3">Healthcare</option>
                        <option value="4">Transportation</option>
                        <option value="5">Recreation</option>
                        <option value="6">Other</option>
                    </select>
                </div>
                <br/>
                <div>
                    <label>Description</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" onChange={this.handleChange4} value={this.state.description}
                           placeholder="Description" required/>
                </div>
                <br/>

                <div>
                    <label>Enter Amount </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" onChange={this.handleChange2} value={this.state.amount} placeholder="00.00"
                           required/>
                </div>
                <br/>
                <div>
                    <label>Type</label>
                    &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {this.state.category === '6' && (
                    <select onChange={this.handleChange3} value={this.state.type} placeholder="Type">
                        <option value="true">Credit</option>
                        <option value="false">Debit</option>
                    </select>)
                    }
                    {this.state.category === '0' && (
                    <select onChange={this.handleChange3} value={this.state.type} placeholder="Type">
                        <option value="true">Credit</option>
                        <option value="false" disabled>Debit</option>
                    </select>)
                    }
                    {(this.state.category !== '6' && this.state.category !== '0' ) && (
                    <select onChange={this.handleChange3} value={this.state.type2} placeholder="Type">
                        <option value="false">Debit</option>
                        <option value="true" disabled>Credit</option>   
                    </select>)
                    }
                    
                </div>
                <br/><br/>
                <button className="add" onClick={this.handleSubmit} disabled={inProgress}>ADD</button>
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
