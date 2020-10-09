import React, { Component } from 'react';
import {connect} from "react-redux";
import { fetchTransactions } from '../actions/pages';
import { clearAuth} from "../actions/pages";
import TransactionEntry from './TransactionEntry';


class PastTransactions extends Component {
    


      //fetch list of past transactions
    componentDidMount(){ 
        this.props.dispatch(fetchTransactions());
    }
    componentWillUnmount(){
        this.props.dispatch(clearAuth());
    }
    handleUpdate =(id) =>{
        //this.props.dispatch(updateTransaction(id));
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
        
        const {transactions,loading} = this.props.details;
        if(loading)
        {
            return <h2>Loading.....</h2>;
        }
        
        if(transactions.length === 0)
        {
            return <h2>No Past Transactions to Display</h2>
        }
        return (
            <div className="form-box2">
                <h2>PAST TRANSACTIONS</h2><br></br>
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
                <div className="transaction-entry">
                    <div className="number headers"> No. </div>
                    <div className="category headers">Category</div>  
                    <div className="amount headers">Amount &nbsp;(Rs.)</div>
                    <div className="type headers">Type</div>
                    <div className="Options headers">Options</div>
                </div>
                <div className="transactions-box">
                    { transactions.map((transaction,index)=>(
                        <TransactionEntry transaction={transaction} index={index} key={`transaction.category-${index}`}/>
                    ))
                    }
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