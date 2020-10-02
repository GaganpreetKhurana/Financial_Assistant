import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from './Home'
import SignUp from './SignUp';
import Navbar from './Navbar';
import Login from './Login';
import Footer from './Footer';
import Page404 from './Page404';
import Forgot from './Forgot';
import Details from './Details';
import * as jwtDecode from "jwt-decode";
import {authenticateUser} from '../actions/auth';


class App extends Component {
    componentDidMount() {
        const token = localStorage.getItem("token");

        if (token) {
            const user = jwtDecode(token);
            this.props.dispatch(
                authenticateUser({
                    email: user.email,
                    name: user.name,
                })
            );
            //anything that has to be fetched initially
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <Navbar/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/sign-up" component={SignUp}/>
                        <Route path="/forgot" component={Forgot}/>
                        <Route path="/details" component={Details}/>
                        <Route component={Page404}/>
                    </Switch>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

export default connect(mapStateToProps)(App);


