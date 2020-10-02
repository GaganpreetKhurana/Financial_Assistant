import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login, clearAuth } from '../actions/auth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: '',
          password: '',
        };
      }
      //to clear the error if it comes on reload or whenever the user shifts from this page
      componentWillUnmount() {
        this.props.dispatch(clearAuth());
      }
    
      handleSubmitForm = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
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
        const { inProgress, error, isLoggedIn } = this.props.auth;

        //so that logged in user don't sees the login page
        if (isLoggedIn) {
          return <Redirect to="/" />;
        }
        return (
        <div className="home-screen">
            <div className="login-form">
                <div className="header">
                    <p>Log In</p>
                </div>
                
                <div className="form-fields">
                    {error && <div className="alert-done"><button>Error</button></div>}
                    
                    <input type="email" placeholder="Email" required onChange={this.handleEmail} />
                    <input type="password" placeholder="Password" required onChange={this.handlePassword} />
                    <button onClick={this.handleSubmitForm} disabled={inProgress}>Submit</button>
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