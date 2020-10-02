import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Details extends Component {

    render() {
    const { inProgress, error, isLoggedIn } = this.props.auth;

    //so that not logged in user don't sees the details page
    {
        /*
    if (!isLoggedIn) {
      return <Redirect to="/" />;
    }
*/}

        return (
            <div className="Main-Page">
                <div className="choice">
                    <div class="details">
                        <button>FORM</button>
                    </div>
                    <div class="chatbot">
                        <button>CHAT BOT</button>
                    </div>
                </div>

                
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
      auth: state.auth,
      details : state.details,
    };
  }
  
  export default connect(mapStateToProps)(Details);