import React, {Component} from "react";
import {connect} from "react-redux";
import DetailsPage from './DetailsPage';
import ChatBotPage from './ChatBotPage';
import PastTransactions from './PastTransactions';
import {showDetails, showChatBot,viewdetails} from "../actions/pages";

class Details extends Component {
    applyDetailsForm = () => {    
        this.props.dispatch(showDetails());
        };

    applyChatBot = () => {
        this.props.dispatch(showChatBot());
        };
    viewDetails = () => {
        this.props.dispatch(viewdetails());
    };

    render() {
        const { isLoggedIn} = this.props.auth;
        const {detailsForm,chatBot,viewPastDetails} = this.props.details;
        

        

        //so that not logged in user don't sees the details page
        //if (!isLoggedIn) {
         // return <Redirect to="/" />;
       // }
        return (
            //complete page
            <div className="home-screen">

                {/*box starting*/}
                <div className="Main-Page">

                    {/*choice to select details page or chat bot page*/}
                    <div className="choice">
                        <div className="details">
                            <button className={`tab${detailsForm?'active-tab':''}`} onClick={this.applyDetailsForm}>DETAIL FORM</button>
                        </div>
                        <div className="chatbot">
                            <button className={`tab${chatBot?'active-tab':''}`} onClick={this.applyChatBot}>Chat Bot</button>
                        </div>
                        <div className="view-details">
                            <button className={`tab${viewPastDetails?'active-tab':''}`} onClick={this.viewDetails}>View Details</button>
                        </div>
                    </div>

                    {detailsForm && <DetailsPage/>}
                    {chatBot && <ChatBotPage/>}
                    {viewPastDetails && <PastTransactions/>}
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
