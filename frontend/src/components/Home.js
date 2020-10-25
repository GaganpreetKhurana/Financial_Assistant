import React, {Component} from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import "../styles.css";
import amazon_img from "../project_images/amazon.png"
import chat_img from "../project_images/chat.png"
import stocks_img from "../project_images/stocks.png"
import transact_img from "../project_images/transact.png"
import view_img from "../project_images/view.png"
import visualizations_img from "../project_images/visualizations.png"

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

class Home extends Component {
    
    render() {
        const {isLoggedIn} = this.props.auth;
        if (isLoggedIn) {
            return <Redirect to="/details"/>;
        }

        return (
            <div className="home-screen">
                <div id='body'>
                <Grid container  justify="space-between" spacing={2}>
                <Header/>
                <Grid align="center">
                <br></br><br></br>
                </Grid>
                <Grid align="center">
                <Paper elevation={12}>
                <Box 
                    title='About the Project' 
                    description='DONNA is a financial assistant who helps you get more for your money.It is basically an application which helps a user keep track of all their financial expenditures 
                    and help the user to spend smarter and save more and help us get more for our money'
                /></Paper>
                <br></br><br></br>
                </Grid>
                <Grid align="center">
                <Paper elevation={12}>
                <Box 
                    title='Our Motivation'
                    description='Living while constantly worrying about money is no fun. 
                    Nevertheless, money is the main cause of stress in the world.Simply put, we were not made to stress about money.
                     As humans, our natural instincts urge us to do what we love.That’s why DONNA should exist.
                    She will help us get more for our money so we can focus on what really matters: enjoying life.'
                /></Paper>
                <br></br><br></br>
                </Grid>
                <Grid align="center">
                <Paper elevation={12}>
                <Box 
                    title='What can Donna Do for you?' 
                    description='This Web Application is accompanied with an AI Chat Bot wherein the user can
                    provide specific details like his monthly budget he has finalized on different activities, his 
                    interest fields, his spending activities etc and on the basis of that DONNA will help the user 
                    to save more.'
                /></Paper>
                <br></br><br></br>
                </Grid>
                </Grid>
                <FeaturesHeader/>
                <Grid container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={24}>
                <Grid item xs={4}>
                <Paper elevation={8}>
                <Box 
                    className='section'
                    title='Track' 
                    description = 'You can view your entire history or filter to a specific query' 
                />
                <img src={view_img} alt="Logo" style={{height:'300px',width:'500px' }} /></Paper></Grid>
                <Grid item xs={4}>
                <Paper elevation={8}>
                <Box 
                    className='section'
                    title='Visualize' 
                    description = 'Visualize your expenditure for better understanding' 
                />
                <img src={visualizations_img} alt="Logo" style={{height:'300px',width:'500px' }} /></Paper></Grid>
                <Grid item xs={4}>
                <Paper elevation={8}>
                <Box 
                    className='section'
                    title='Amazon Wishlist'
                    description = 'Donna allows you to track your amazon wishlist and gives intelligent price drop recommendations' 
                />
                <img src={amazon_img} alt="Logo" style={{height:'300px',width:'500px' }} /></Paper></Grid>
                <Grid item xs={4}>
                <Paper elevation={8}>
                <Box 
                    className='section'
                    title='Chat bot' 
                    description = 'Donna allows you to interact easily with the system using a friendly chat bot' 
                />
                <img src={chat_img} alt="Logo" style={{height:'300px',width:'500px' }} /></Paper></Grid>
                <Grid item xs={4}>
                <Paper elevation={8}>
                <Box 
                    className='section'
                    title='Stock Portfolio' 
                    description = 'Track your Stock portfolio with the ability to easily buy and sell stocks' 
                />
                <img src={stocks_img} alt="Logo" style={{height:'300px',width:'500px' }} /></Paper></Grid>
                <Grid item xs={4}>
                <Paper elevation={8}>
                <Box 
                    className='section'
                    title='Daily Transactions' 
                    description = 'Enter your daily transaction using this easy to fill form' 
                />
                <img src={transact_img} alt="Logo" style={{height:'300px',width:'500px' }} /></Paper></Grid>
                </Grid>
            </div> 
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}
const Header = () =>{
    return(
        <div className='header'>
            <span className='header-title'>
                Donna
            </span>
            <br/>
            <span className="header-text">
                Your all in one Financial Assistant
            </span>
        </div>
    );
}
const FeaturesHeader = () =>{
    return(
        <div className='header'>
            <span className='header-title'>
                Features
            </span>
            <br/>
        </div>
    );
}
const Box = (props) =>{
    return(
        <div className={props.className} >
            <div className="small-div">
                <i className={props.className}></i>
                <img src={props.img} alt=''/>
            </div>

            <div className="big-div">
                <span className='div-title'>
                    {props.title}
                </span>
                <br/>
                <span>
                    {props.description}
                </span>
            </div>
        </div>
    )
}



export default connect(mapStateToProps)(Home);
