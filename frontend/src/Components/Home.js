import React, { Component } from 'react';

class Home extends Component {
    render() {
        return (
        <div className="home-screen">
            <div className="login-form">
                <div className="header">
                    <p>Log In</p>
                </div>
                
                <div className="form-fields">
                    {/*<div className="alert-done"><button>Error</button></div>*/}
                    <input type="text" placeholder="Username" />
                    <input type="text" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Submit</button>

                    
                    

                </div>

            </div>
            
        </div>
        );
    }
}

export default Home;