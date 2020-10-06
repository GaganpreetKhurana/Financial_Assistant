import React, {Component} from "react";
import {connect} from "react-redux";
import DetailsPage from './DetailsPage';
import ChatBotPage from './ChatBotPage';

class Details extends Component {
    applyDetailsForm = () => {    
        this.props.dispatch();
        };

    applyChatBot = () => {
        this.props.dispatch();
        };

    render() {
        const { isLoggedIn} = this.props.auth;
        const {detailsForm,chatBot} = this.props.details;
        console.log(detailsForm);

        

        //so that not logged in user don't sees the details page
        //if (!isLoggedIn) {
         // return <Redirect to="/" />;
       // }
        return (
            <div className="home-screen">
                <div className="Main-Page">
                    <div className="choice">
                        <div className="details">
                            <button className={`tab${detailsForm?'active-tab':''}`} onClick={this.applyDetailsForm}>DETAIL FORM</button>
                        </div>
                        <div className="chatbot">
                            <button className={`tab${chatBot?'active-tab':''}`} onClick={this.applyChatBot}>Chat Bot</button>
                        </div>
                    </div>

                    {detailsForm && <DetailsPage/>}
                    {chatBot && <ChatBotPage/>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        details: state.details,
    };
}

export default connect(mapStateToProps)(Details);
