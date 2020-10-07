import React, { Component } from 'react';
import {connect} from "react-redux";
import { fetchTransactions } from '../actions/pages';

class PastTransactions extends Component {
    


      //fetch list of past transactions
    componentDidMount(){ 
        this.props.dispatch(fetchTransactions());
    }


    render() {
        const {transactions,loading} = this.props.details;
        /*if(loading)
        {
            return <h2>Loading.....</h2>;
        }
        
        if(transactions.length === 0)
        {
            return <h2>No Transactions to Display</h2>
        }
        */
        return (
            <div>
                
                Past Transactions
                
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