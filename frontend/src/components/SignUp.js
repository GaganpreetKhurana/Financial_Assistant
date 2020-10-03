import React, {Component} from 'react';
import {Redirect} from "react-router-dom";

import {connect} from "react-redux";
import {signup, clearAuth} from "../actions/auth";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname:"",
            lname:"",
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
        };
    }

    //to clear the error if it comes on reload or whenever the user shifts fro this page
    componentWillUnmount() {
        this.props.dispatch(clearAuth());
    }

    //to submi the form
    handleSubmitForm = (e) => {
        e.preventDefault();
        const {email, password, confirmPassword, name,fname,lname} = this.state;
        if (email && confirmPassword && name && password) {
            this.props.dispatch(signup(email, password, confirmPassword, name,fname,lname));
        }
    };

    //taking inputs
    handleEmail = (e) => {
        this.setState({
            email: e.target.value,
        });
    };
    handleLName = (e) => {
        this.setState({
            lname: e.target.value,
        });
    };
    handleFName = (e) => {
        this.setState({
            fname: e.target.value,
        });
    };
    handleName = (e) => {
        this.setState({
            name: e.target.value,
        });
    };
    handlePassword = (e) => {
        this.setState({
            password: e.target.value,
        });
    };
    handleCPassword = (e) => {
        this.setState({
            confirmPassword: e.target.value,
        });
    };

    render() {
        const {inProgress, error,success, isLoggedIn} = this.props.auth;
        if (isLoggedIn) {
            return <Redirect to="/details"/>;
        }
        return (
            <div className="home-screen">
                <div className="register-form">
                    <div className="header">
                        <p>Sign Up</p>
                    </div>

                    <div className="form-fields">
                        {error && <div className="alert-warn">
                            <button>{error}</button>
                        </div>}
                        {success && <div className="alert-done">
                            <button>{success}</button>
                        </div>}
                        <input type="text" placeholder="First Name" required onChange={this.handleFName}/>
                        <input type="text" placeholder="Last Name" required onChange={this.handleLName}/>
                        <input type="text" placeholder="Username" required onChange={this.handleName}/>
                        <input type="email" placeholder="Email" required onChange={this.handleEmail}/>
                        <input type="password" placeholder="Password" required onChange={this.handlePassword}/>
                        <input type="password" placeholder="Confirm Password" required onChange={this.handleCPassword}/>
                        <button onClick={this.handleSubmitForm} disabled={inProgress}>Sign Up</button>
                    </div>

                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

export default connect(mapStateToProps)(SignUp);
