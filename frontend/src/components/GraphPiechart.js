import React, { Component } from 'react';
import {connect} from "react-redux";


class   GraphPiechart extends Component {

    render() {
        return (
            
                   <div >
                       Piechart
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

export default connect(mapStateToProps)(GraphPiechart);