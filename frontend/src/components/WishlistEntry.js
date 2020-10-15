import React, { Component } from 'react';
import {connect} from "react-redux";


class WishlistEntry extends Component {

    render() {
    const {entry,index}=this.props;
        return (
            
                   <div className="transaction-entry">
                        <div className="numb "> {index+1+"."} </div>
                        <div className="url ">{entry.url}</div>  
                        <div className="price">&nbsp;&nbsp;&nbsp;&nbsp;{entry.price}</div>
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

export default connect(mapStateToProps)(WishlistEntry);