import React, { Component } from 'react';

class SignUp extends Component {
    render() {
        return (
            <div className="home-screen">
            <div className="register-form">
                <div className="header">
                    <p>Log In</p>
                </div>
                
                <div className="form-fields">
                    {/*<div className="alert-done"><button>Error</button></div>*/}
                    <input type="text" placeholder="Username" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input type="password" placeholder="Confirm Password" />
                    <button>Sign Up</button>
                </div>

            </div>
            
        </div>
        );
    }
}

export default SignUp;