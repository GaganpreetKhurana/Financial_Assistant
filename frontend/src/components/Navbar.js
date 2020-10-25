import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {logoutUser} from "../actions/auth";

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class Navbar extends Component {
    logout = () => {
        localStorage.removeItem("DONNA");
        this.props.dispatch(logoutUser());
    };

    render() {
        const {auth} = this.props;
        return (
            <div className="navbar">
                <AppBar position="static" color="transparent">
                <Toolbar>
                <Grid container  justify="space-between">
                <Grid>
                <div className="nav-left">
                <Typography type="title">
                    <Link to="/">DONNA</Link>
                </Typography>
                </div>
                </Grid>
                <Grid item xs={9} align="center"><div id="google_translate_element"></div></Grid>
                <Grid><div className="nav-right">
                    {!auth.isLoggedIn && (<Button variant="contained" color="secondary" ><Link to="/login">Login</Link></Button>)}
                    {auth.isLoggedIn && (<button className="bttn-home"> <Link to="/profile">{auth.user.username} </Link></button>)}
                    {!auth.isLoggedIn && (<Button variant="contained" color="primary" ><Link to="/sign-up">Sign Up</Link></Button>)}
                    {auth.isLoggedIn && (<Button variant="contained" color="secondary" onClick={this.logout}>Log Out</Button>)}
                </div></Grid>
                </Grid>
                </Toolbar>
                </AppBar>

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
