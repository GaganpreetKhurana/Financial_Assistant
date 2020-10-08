import React, { Component } from 'react';
import {connect} from "react-redux";
import { fetchTransactions } from '../actions/pages';
import { clearAuth} from "../actions/pages";


class PastTransactions extends Component {
    


      //fetch list of past transactions
    componentDidMount(){ 
        this.props.dispatch(fetchTransactions());
    }
    componentWillUnmount(){
        this.props.dispatch(clearAuth());
    }
    handleUpdate =(id) =>{
        this.props.dispatch(updateTransaction(id));
        setTimeout(() => {
            //this.forceUpdate();
            this.props.dispatch(clearAuth());
        }, 10000);
    }

    handleDelete =(id) =>{
        //this.props.dispatch(deleteTransaction(id));
        setTimeout(() => {
            //this.forceUpdate();
            this.props.dispatch(clearAuth());
        }, 10000);
    }

    render() {
        const {success,error} = this.props.details;
        
        //const {transactions,loading} = this.props.details;
        /*if(loading)
        {
            return <h2>Loading.....</h2>;
        }
        
        if(transactions.length === 0)
        {
            return <h2>No Past Transactions to Display</h2>
        }
        */
        return (
            <div className="form-box2">
                <h2>PAST TRANSACTIONS</h2><br></br>
                {error && (
                    <div className="alert-warn">
                        <button>{error}</button>
                    </div>
                        )}
                {!success && (
                    <div className="alert-done">
                        <button>{success}</button>
                    </div>
                )}
                <div className="transaction-entry">
                    <div className="number headers"> No. </div>
                    <div className="category headers">Category</div>  
                    <div className="amount headers">Amount &nbsp;(Rs.)</div>
                    <div className="type headers">Type</div>
                    <div className="Options headers">Options</div>
                </div>
                <div className="transactions-box">
                   <div className="transaction-entry">
                        <div className="number "> 1. </div>
                        <div className="category ">Income</div>  
                        <div className="amount">22.22</div>
                        <div className="type">Credit</div>
                        <div  className="update "><button onClick={this.handleUpdate(1)}>Update</button></div>
                        <div  className="delete "><button onClick={this.handleDelete(1)}>Delete</button></div>
                   </div>
                   <div className="transaction-entry">
                        <div className="number "> 2. </div>
                        <div className="category ">Housing</div>  
                        <div className="amount">4000</div>
                        <div className="type">Debit</div>
                        <div  className="update "><button>Update</button></div>
                        <div  className="delete "><button>Delete</button></div>
                   </div>
                   <div className="transaction-entry">
                        <div className="number "> 3. </div>
                        <div className="category ">Transportation</div>  
                        <div className="amount">5000</div>
                        <div className="type">Debit</div>
                        <div  className="update "><button>Update</button></div>
                        <div  className="delete "><button>Delete</button></div>
                   </div>
                   <div className="transaction-entry">
                        <div className="number "> 4. </div>
                        <div className="category ">Bank Interest</div>  
                        <div className="amount">40</div>
                        <div className="type">Credit</div>
                        <div  className="update "><button>Update</button></div>
                        <div  className="delete "><button>Delete</button></div>
                   </div>
                </div>
                
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

export default connect(mapStateToProps)(PastTransactions);