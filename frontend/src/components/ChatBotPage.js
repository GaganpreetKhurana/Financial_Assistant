import React, {Component} from 'react';
import {connect} from "react-redux";
//actions
import {addChatMessage, newMessage, pastMessages} from "../actions/pages";
//components
import ChatMessage from './ChatMessage';
//react-say to convert text to speech
import {SayButton} from 'react-say';

class ChatBotPage extends Component {
    constructor(props) {
        super(props);
        //state
        this.state = {
            typedMessage: "",
        };
    }

    //fetch past messages from the chatbot
    componentDidMount() {
        this.props.dispatch(pastMessages());

    }
    //input chat field
    handleChange = (event) => {
        this.setState({typedMessage: event.target.value});
    }

    //send the message to the chatbot
    handleSubmit = (e) => {
        e.preventDefault();
        const {typedMessage} = this.state;
        if (typedMessage) {
            //self true indicates message sent by user
            var new_message = {content: typedMessage, self: true};
            this.props.dispatch(addChatMessage(new_message));
            var self = true;
            this.props.dispatch(newMessage(typedMessage, self));
        }
        this.setState({
            typedMessage: "",
        });
    };

    render() {
        const {messages} = this.props.details;
        let text_to_be_spoken = "";
        if (messages[messages.length - 1]) {
            text_to_be_spoken = messages[messages.length - 1].content;
        }


        return (
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <ChatMessage message={message} key={`message.content-${index}`}/>))}
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        onChange={this.handleChange}
                        placeholder="Type your Message here......"
                        value={this.state.typedMessage}

                    />
                    {/* to convert text to speech */}
                    <SayButton text={text_to_be_spoken}/>
                    <button onClick={this.handleSubmit}>
                        Submit
                    </button>
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

export default connect(mapStateToProps)(ChatBotPage);
