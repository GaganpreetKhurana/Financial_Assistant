import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="nav-left">
                    <a href="localhost:8000">DONNA</a>
                </div>
                <div className="nav-right">
                    
                    <button className="bttn-home"><i className="far fa-user"></i>Login</button>
                    <button className="bttn-home"><i className="fas fa-user-plus"></i>Sign Up</button>
                </div>
            </div>
        );
    }
}

export default Navbar;