import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {connect} from 'react-redux';
//actions
import {clearAuth, reset} from "../actions/auth";
import {updateTransactionFailure,} from '../actions/pages';

//components
import Background from './Background';


class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pswd: '',
            cpswd: ''
        };
    }

    //to clear the error if it comes on reload or whenever the user shifts from this page
    componentWillUnmount() {
        this.props.dispatch(clearAuth());
    }


    //handle submit button
    handleSubmitForm = (e) => {
        e.preventDefault();
        const {pswd, cpswd} = this.state;
        if (pswd === cpswd) {
            this.props.dispatch(reset(pswd, this.props.match.params.token));
        } else {
            this.props.dispatch(updateTransactionFailure("Password and Confirm Password Fields don't match !!!!"))
        }
    };
    //handle input field
    handlepswd = (e) => {
        this.setState({
            pswd: e.target.value,
        });
    };
    handlecpswd = (e) => {
        this.setState({
            cpswd: e.target.value,
        });
    };

    render() {
        const {token} = this.props.match.params
        const {inProgress, success, error, isLoggedIn} = this.props.auth;
        console.log(this.props);
        console.log(token)

        //so that logged in user don't see the Forgot Password page even if he tries to manupalate url
        if (isLoggedIn) {
            return <Redirect to="/details"/>;
        }
        return (
            <div className="home-screen">
                <Background/>
                <div className="forgot-form"><br/><br/>
                    <h5 style={{paddingLeft: '65px'}}>Enter New Password</h5><br/><br/>

                    <div className="form-fields">
                        {error && <div className="alert-warn">
                            <button>{error}</button>
                        </div>}
                        {success && <div className="alert-done">
                            <button>{success}</button>
                        </div>}
                        <br></br>
                        <input type="password" placeholder="New Password" required onChange={this.handlepswd}/>
                        <input type="password" placeholder="Confirm Password" required onChange={this.handlecpswd}/>
                        <button onClick={this.handleSubmitForm} disabled={inProgress}>Submit</button>
                        <br></br><br></br>
                        <p className="Forgot"> OR</p><br></br>
                        <p className="Forgot"><Link to="/login">Login</Link> | <Link to="/sign-up">New User</Link></p>
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

export default connect(mapStateToProps)(ResetPassword);
