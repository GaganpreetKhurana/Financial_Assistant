import React, {Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import DetailsPage from './DetailsPage';
import ChatBotPage from './ChatBotPage';
import PastTransactions from './PastTransactions';
import StockPage from './StockPage';
import AmazonPage from './AmazonPage';
import {showDetails, showChatBot,viewdetails,showStockDetails,showAmazonDetails} from "../actions/pages";

// import {Bar} from 'react-chartjs-2';

// const state = {
//     labels: ['January', 'February', 'March',
//              'April', 'May'],
//     datasets: [
//       {
//         label: 'Expenditure',
//         backgroundColor: 'rgba(75,192,192,1)',
//         borderColor: 'rgba(0,0,0,1)',
//         borderWidth: 2,
//         data: [65, 59, 80, 81, 56]
//       }
//     ]
//   }

class Details extends Component {
    applyDetailsForm = () => {    
        this.props.dispatch(showDetails());
        };

    applyChatBot = () => {
        this.props.dispatch(showChatBot());
        };
    applyStock = () => {
        this.props.dispatch(showStockDetails());
    };
    applyAmazon = () => {
        this.props.dispatch(showAmazonDetails());
    };
    viewDetails = () => {
        this.props.dispatch(viewdetails());
    };

    render() {
        const { isLoggedIn} = this.props.auth;
        const {detailsForm,chatBot,viewPastDetails,amazon,stock} = this.props.details;
        

        

        //so that not logged in user don't sees the details page
        if (!isLoggedIn) {
          return <Redirect to="/" />;
        }
        return (
            //complete page
            <div className="home-screen">

                {/*box starting*/}
                <div className="Main-Page">
                    {/* <div>
                        <Bar
                        data={state}
                        options={{
                            title:{
                            display:true,
                            text:'Expenditure per month',
                            fontSize:20
                            },
                            legend:{
                            display:true,
                            position:'right'
                            }
                        }}
                        />
                    </div> */}
                    {/*choice to select details page or chat bot page*/}
                    <div className="choice">
                        <div className="details">
                            <button className={`tab${detailsForm?'active-tab':''}`} onClick={this.applyDetailsForm}>DETAIL FORM</button>
                        </div>
                        <div className="chatbot">
                            <button className={`tab${chatBot?'active-tab':''}`} onClick={this.applyChatBot}>Chat Bot</button>
                        </div>
                        <div className="view-details">
                            <button className={`tab${viewPastDetails?'active-tab':''}`} onClick={this.viewDetails}>Transactions</button>
                        </div>
                        <div className="amazon">
                            <button className={`tab${amazon?'active-tab':''}`} onClick={this.applyAmazon}>Amazon Details</button>
                        </div>
                        <div className="stock">
                            <button className={`tab${stock?'active-tab':''}`} onClick={this.applyStock}>Stock Details</button>
                        </div>
                    </div>

                    {detailsForm && <DetailsPage/>}
                    {chatBot && <ChatBotPage/>}
                    {viewPastDetails && <PastTransactions/>}
                    {stock && <StockPage/>}
                    {amazon && <AmazonPage/>}
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
