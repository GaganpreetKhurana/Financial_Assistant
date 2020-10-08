import React, { Component } from 'react';
import {connect} from "react-redux";
import {addTransaction, clearAuth} from "../actions/pages";
class DetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: 'Income',
            amount:'',
            type:'Credit',
            description:'',
            dummy:null,
        };
      }
      handleChange= (event)=>{
        this.setState({category: event.target.value});
      }
      handleChange2= (event)=>{
        this.setState({amount: event.target.value});
      }

      handleChange3= (event)=>{
        this.setState({type: event.target.value});
      }
      handleChange4= (event)=>{
        this.setState({description: event.target.value});
      }

    
      handleSubmit = (e) => {
        //call dispatch
        e.preventDefault();
        const {category,type,description,amount} = this.state;
        console.log(category,type,description,amount);
        //this.props.dispatch(addTransaction(category,type,description,amount));
        
        setTimeout(() => {
            //this.forceUpdate();
            this.props.dispatch(clearAuth());
        }, 1000);

        this.setState({category: 'Income',
            amount:'',
            type:'Credit',
            description:'',
            dummy:null,});

      }
      componentWillUnmount(){
          this.props.dispatch(clearAuth());
      }
      
    render() {
        console.log("rendering");
        const {success,error,inProgress} = this.props.details;
        const {isLoggedIn} = this.props.auth;
        //if (!isLoggedIn) {
            //return <Redirect to="/login"/>;
        //}
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
                        <button>{success}</button>
                    </div>
                )}
                <div>
                    <label>Chose Category</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <select onChange={this.handleChange} placeholder="Category">
                        <option value="Income">Income</option>
                        <option value="Housing">Housing</option>
                        <option value="Food">Food</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Recreation">Recreation</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                        <option value="Other">Other</option>
                    </select>
                </div><br></br>
                {(this.state.category==='Other' || this.state.category==='Miscellaneous' ) && <div>
                    <label>Please Specify</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" onChange={this.handleChange4} placeholder="Description" required/>
                    </div> }
                {(this.state.category==='Other' || this.state.category==='Miscellaneous' )  && <br></br>}
                
                <div>
                    <label>Enter Amount</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" onChange={this.handleChange2} placeholder="00.00" required/>
                </div><br></br>
                <div>
                    <label>Chose Type</label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <select onChange={this.handleChange3} placeholder="Type">
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                    </select>
                </div><br></br><br></br>
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