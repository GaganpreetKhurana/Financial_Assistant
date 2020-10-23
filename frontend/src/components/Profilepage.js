import React, {Component} from 'react';
import {connect} from "react-redux";
import {fetchUser} from '../actions/auth';



class Profilepage extends Component {
    constructor(){
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(authenticateUser());
        
    }
    render() {
        const {auth} = this.props;
        console.log("@@@@@@@@@@@@@",auth.user);
        return (
            <div>Profile page</div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

export default connect(mapStateToProps)(Profilepage);


