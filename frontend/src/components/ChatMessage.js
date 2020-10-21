import React, {Component} from 'react';
import {connect} from "react-redux";

class ChatMessage extends Component {


    render() {
        const {message} = this.props;
        return (

            <div
                className={
                    message.self
                        ? 'chat-bubble self-chat'
                        : 'chat-bubble other-chat'
                }
            >
                {message.content}

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

export default connect(mapStateToProps)(ChatMessage);
