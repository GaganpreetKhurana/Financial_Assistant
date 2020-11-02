import React, { Component } from 'react';
import {connect} from "react-redux";


class GraphPiechart2 extends Component {
    render() {
        return (
            <div>
                
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

export default connect(mapStateToProps)(GraphPiechart2);