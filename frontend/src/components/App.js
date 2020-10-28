import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
//all components 
import Home from './Home'
import SignUp from './SignUp';
import Navbar from './Navbar';
import Login from './Login';
import Footer from './Footer';
import Page404 from './Page404';
import Forgot from './Forgot';
import Details from './Details';
import Profile from './Profilepage';
 // @ts-ignore 
 //to decode the token 
 import jwt_decode from "jwt-decode";
 //actions
import {authenticateUser} from '../actions/auth';


class App extends Component {
    componentDidMount() {
        const token = localStorage.getItem("DONNA");

        if (token) {
            //if token exists decode the token and set the user details in redux store
            const user = jwt_decode(token);
            this.props.dispatch(
                authenticateUser({
                    username: user.username,
                    email :user.email,
                    user_id:user.user_id
                })
            );
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
                        <Route path="/profile" component={Profile}/>
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


