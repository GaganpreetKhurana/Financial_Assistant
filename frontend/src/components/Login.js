import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {login, clearAuth} from "../actions/auth";

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

    handleSubmitForm = (e) => {
        e.preventDefault();
        const {email, password} = this.state;
        if (email && password) {
            this.props.dispatch(login(email, password));
        }
    };
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

                        <input
                            type="text"
                            placeholder="Username"
                            required
                            onChange={this.handleEmail}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            onChange={this.handlePassword}
                        />
                        <button onClick={this.handleSubmitForm} disabled={inProgress}>
                            Submit
                        </button>
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
