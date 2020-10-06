import React, { Component } from 'react';
import {connect} from "react-redux";

class DetailsPage extends Component {
    render() {
        return (
            <div >
                Add Details
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

export default connect(mapStateToProps)(DetailsPage);