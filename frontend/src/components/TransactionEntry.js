import React, { Component } from 'react';

class TransactionEntry extends Component {
    render() {
    const {transaction,index}=this.props;
        return (
            
                   <div className="transaction-entry">
                        <div className="number "> {index+1+"."} </div>
                        <div className="category ">{transaction.category}</div>  
                        <div className="amount">{transaction.amount}</div>
                        <div className="type">Credit</div>
                        <div  className="update "><button >Update</button></div>
                        <div  className="delete "><button >Delete</button></div>
                   </div>
                    
        );
    }
}



export default TransactionEntry;