import React, {Component} from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";

class Home extends Component {
    
    render() {
        const {isLoggedIn} = this.props.auth;
        if (isLoggedIn) {
            return <Redirect to="/details"/>;
        }

        return (
            <div className="home-screen">
                Home Page yet to be designed!!!
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps)(Home);
