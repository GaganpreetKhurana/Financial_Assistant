import React, {Component} from 'react';
import {connect} from "react-redux";
import {addChatMessage, newMessage, pastMessages} from "../actions/pages";
import ChatMessage from './ChatMessage';

import Say from 'react-say';

class ChatBotPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            typedMessage: "",
        };
    }

    //fetch past messages from the chatbot
    componentDidMount() {
        this.props.dispatch(pastMessages());

    }

    handleChange = (event) => {
        this.setState({typedMessage: event.target.value});
    }

    //send the message to the chatbot
    handleSubmit = (e) => {
        e.preventDefault();
        const {typedMessage} = this.state;
        if (typedMessage) {
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
        var dummy= messages[messages.length -1];
        var tex="";
        if(dummy)
        {
            tex=dummy.content;
            console.log(tex);
        }
        

        return (
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <ChatMessage message={message} key={`message.content-${index}`}/>))}
                        <Say
                            pitch={ 1.1 }
                            rate={ 1.5 }
                            text={tex}
                            volume={ 0.8 }
                        />
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        onChange={this.handleChange}
                        placeholder="Type your Message here......"
                        value={this.state.typedMessage}

                    />
                    <button onClick={this.handleSubmit}>Submit</button>
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
