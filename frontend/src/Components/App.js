import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';
import Navbar from './Navbar';
import Footer from './Footer';
import Page404 from './Page404';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <div>
            <Navbar/>
            <Route exact path="/" component={Home}/>
            <Route path="/sign-in" component={SignIn}/>
            <Route component={Page404} />
            <Footer/>
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;


