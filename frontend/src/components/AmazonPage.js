import React, { Component } from 'react';
import {connect} from "react-redux";


class AmazonPage extends Component {
    render() {
    const {wishlist}=this.props;

        return (
            <div>
                Amazon Page
                {wishlist}
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

export default connect(mapStateToProps)(AmazonPage);