import React, { Component } from 'react';
import {connect} from "react-redux";
import {fetchStocklist} from "../actions/pages";




class StockPage extends Component {

     //fetch stocklist
     componentDidMount(){ 
        this.props.dispatch(fetchStocklist());
    }
    render() {
    const {stocklist}=this.props.details;
    console.log(stocklist);

        return (
            <div>
               <h2><br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Stocklist</h2>
               <div className="form-box2">
                <div className="wishlist-entry">
                        <div className="numbs headers"> No. </div>
                        <div className="stocks headers">Stocks</div> 
                        <div className="owned headers">Owned Price &nbsp;(Rs.)</div>   
                        <div className="prices headers">Current Price &nbsp;(Rs.)</div>   
                
                </div>
               {stocklist.length === 0 && <div><br></br><h2>No Stocklist to display</h2></div>}
               <div className="transactions-box">
               {stocklist.map((entry,index)=>(
                <div className="transaction-entry" key={`entry.createdAt-${index}`}>
                   <div className="numbs"> {index+1+"."} </div>
                   <div className="stocks ">{entry.stock}</div>  
                   <div className="owned">&nbsp;&nbsp;&nbsp;&nbsp;{entry.owned}</div> 
                   <div className="prices">&nbsp;&nbsp;&nbsp;&nbsp;{entry.current_price}</div>  
                </div>
                    ))
                }
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

export default connect(mapStateToProps)(StockPage);