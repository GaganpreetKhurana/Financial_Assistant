import React, { Component } from 'react';




class ChatBotPage extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        messages: [{content:"Hii Test_1,Donna this side...",self:false},
        {content:"Hii Donna, Nice to meet you",self:true},
        {content:"So how can I help you ?",self:false},
        {content:"Actually I was looking to buy a Titan watch... So if you could show me the best price available on amazon",self:true},
        {content:"Sure why not..",self:false},
        {content:"So Titan watches start from Rs 2000 and goes upto Rs 100000",self:false},
        {content:"I think according to your current budget and your lavishing lifestyle the one around Rs 25000 would suit you better",self:false},
        {content:"Hmmm that's a bit expensive",self:true},
        {content:"I was looking to spend around 10000 or so..",self:true},
        {content:"Ohh then you should go with 9499 one it covers most of the functionalities and will also suit your budget...",self:false},
        {content:"Yaa that's interesting I would definately go with that one... Bye bye Donna",self:true},
        {content:"Welcome test_1... Looking forward to help you out in future as well",self:false}], // {content: 'some message', self: true}
        typedMessage: '',
      };
    }
    render() {
      const { typedMessage, messages } = this.state;
  
      return (
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                className={
                  message.self
                    ? 'chat-bubble self-chat'
                    : 'chat-bubble other-chat'
                }
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your Message here......"
              value={typedMessage}
              onChange={(e) => this.setState({ typedMessage: e.target.value })}
            />
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      );
    }
  }
  
  export default ChatBotPage;