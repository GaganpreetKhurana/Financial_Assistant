import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
//actions
import {login, clearAuth} from "../actions/auth";
//components
import Background from './Background';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    //to clear the error if it comes on reload or whenever the user shifts from this page
    componentWillUnmount() {
        this.props.dispatch(clearAuth());
    }
    //handle submit button
    handleSubmitForm = (e) => {
        e.preventDefault();
        const {email, password} = this.state;
        if (email && password) {
            this.props.dispatch(login(email, password));
        }
    };
    //handle input fields
    handleEmail = (e) => {
        this.setState({
            email: e.target.value,
        });
    };
    handlePassword = (e) => {
        this.setState({
            password: e.target.value,
        });
    };
    render() {
        const {inProgress, error, isLoggedIn,success} = this.props.auth;

        //so that logged in user don't sees the login page
        if (isLoggedIn) {
            return <Redirect to="/details"/>;
        }
        return (
            <div className="home-screen">
                <Background/>
                <div className="login-form">
                    <div className="headerss">
                        <p>Log In</p><br></br><br></br>
                    </div>

                    <div className="form-fields">
                        {error && (
                            <div className="alert-warn">
                                <button>{error}</button>
                            </div>
                        )}
                        {success && (
                            <div className="alert-done">
                                <button>{success}</button>
                            </div>
                        )}
                        <TextField id="standard-basic" placeholder="Username" fullWidth={true} required onChange={this.handleEmail}/>
                        <TextField id="filled-basic" type="password" placeholder="Password" fullWidth={true} required onChange={this.handlePassword}/>
                        <Button variant="contained" onClick={this.handleSubmitForm} disabled={inProgress}>Submit</Button>
                        <br></br><br></br>
                        <p className="Forgot"> OR</p><br></br>
                        <p className="Forgot"><Link to="/forgot">Forgot Password?</Link> | <Link to="/sign-up">New
                            User</Link></p>
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

export default connect(mapStateToProps)(Login);
