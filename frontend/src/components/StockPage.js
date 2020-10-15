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
    console.log("#########",stocklist);
        return (
            <div>
                Stock Page
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