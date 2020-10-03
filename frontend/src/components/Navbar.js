import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {logoutUser} from "../actions/auth";

class Navbar extends Component {
    logout = () => {
        localStorage.removeItem("DONNA");
        this.props.dispatch(logoutUser());
    };

    render() {
        const {auth} = this.props;
        
        return (
            <div className="navbar">
                <div className="nav-left">
                    <Link to="/">DONNA</Link>
                </div>
                
                <div className="nav-right">
                    {!auth.isLoggedIn && (<button className="bttn-home"><Link to="/login">Login</Link></button>)}
                    {auth.isLoggedIn && (<button className="bttn-home"> {auth.user} </button>)}
                    {!auth.isLoggedIn && (<button className="bttn-home"><Link to="/sign-up">Sign Up</Link></button>)}
                    {auth.isLoggedIn && (<button className="bttn-home" onClick={this.logout}>Log Out</button>)}
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

export default connect(mapStateToProps)(Navbar);
