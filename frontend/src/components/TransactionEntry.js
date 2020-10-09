import React, { Component } from 'react';
import {connect} from "react-redux";

import { clearAuth,showUpdateBox,deleteTransaction} from "../actions/pages";

class TransactionEntry extends Component {

    handleUpdate =(id) =>{
        this.props.dispatch(showUpdateBox(id));
    }
    handleDelete =(id) =>{
        this.props.dispatch(deleteTransaction(id));
        setTimeout(() => {
            //this.forceUpdate();
            this.props.dispatch(clearAuth());
        }, 10000);
    }
    render() {
    const {transaction,index}=this.props;
        return (
            
                   <div className="transaction-entry">
                        <div className="number "> {index+1+"."} </div>
                        <div className="category ">{transaction.category==='Miscellaneous' || transaction.category==='Other' ?transaction.description:transaction.category}</div>  
                        <div className="amount">{transaction.amount}</div>
                       {transaction.credit  && <div className="type">Credit</div>}
                       {!transaction.credit  && <div className="type">Debit</div>}
                        <div  className="update "><button onClick={()=>this.handleUpdate(transaction.id)} >Update</button></div>
                        <div  className="delete "><button onClick={()=>this.handleDelete(transaction.id)} >Delete</button></div>
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

export default connect(mapStateToProps)(TransactionEntry);