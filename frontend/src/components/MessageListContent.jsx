import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Blank_Avatar from '../public/Blank-Avatar.png';
import axios from 'axios';
import moment from 'moment';


const MessageListContent = ({socket, currentConversation, user}) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!messages[currentConversation.id]) {
      console.log('fetching');
      axios.get('/conversation/getMessage', {
        headers: {token: user.token},
        params: {conversationId: currentConversation.id}})
      .then((response)=>{
        if (response.data.error.status === 500) {
          return (
            console.log(response.data.error.message)
          )
        }
        console.log(response.data);
        setMessages(prevMessages=> {
          return {...prevMessages, [currentConversation.id]:(response.data.data.chats||[])}
        });
      }).catch((err)=>{
        console.log(err)
      })
    }
  },[currentConversation, user, setMessages]);

  useEffect(() => {
    socket.on("message", ({action, data}) => {
      switch (action) {
        case 'newMessage': 
          setMessages(prevMessages => {
            console.log(data);
            const conversation = prevMessages[data.chat.conversationId];
            console.log(conversation);
            const existed = conversation.find(message => message.id == data.chat.id);
            if (!existed){
              console.log('new message');
              return {...prevMessages, [data.chat.conversationId]:[...(prevMessages[data.chat.conversationId]||[]), data.chat]}
            }
            return prevMessages;
          });
          break
        /* case 'update':
          const nextConversations = conversations.map(conversation => {
            if (conversation.id == data.conversation.id) {
              return data.conversation;
            } else {
              return conversation;
            }
          });
          setConversations(nextConversations);
          break */
        default:
      }
    });

    return () => {
      socket.off("message");
    }
  }, [socket, setMessages, currentConversation]);

  /* componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
    }
  } */

  const scrollToBottom = () => {
    messageEnd && messageEnd.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    scrollToBottom();
  })
  const [messageEnd, setMessageEnd] = useState();
  const isFirstOfSenderGroup = (message, index) => {
    return index===0 || messages[currentConversation.id][index-1].userId !== message.userId
  }

  const isNewDay = (message, index) => {
    return index===0 || false
  }
  if (!(messages[currentConversation.id]&&messages[currentConversation.id].length)) return (
    <Card.Body 
      id="message_list-container-content"
      style={{overflowY: 'scroll'}}
    >
      <div className="divider d-flex flex-row justify-content-center mb-4">
        <p
          className="text-center mx-3 mb-0"
          style={{ color: "#a2aab7" }}
        >
          No Messages Loaded.
        </p>
      </div>
    </Card.Body>
  )
  
  const listItems = messages[currentConversation.id].map((message, index) => {
    const newDay = isNewDay(message, index);
    const firstInGroup = isFirstOfSenderGroup(message, index);
    const createdAt = new Date(message.createdAt);
    const errorHandler = (event) => {
      console.log('ImgErrorHandler');
      event.currentTarget.src = Blank_Avatar;
    };
    return (
      <div 
        id="message_list-container-content-item-wrapper" 
        key={message.id}
      >
        {/*Display date*/}
        {newDay && (
          <div className="divider d-flex flex-row justify-content-center mb-4">
            <p
              className="text-center mx-3 mb-0"
              style={{ color: "#a2aab7" }}
            >
              Today
            </p>
          </div>
        )}
        {/*Display [avatar], [senderName], message, sendTime*/}
        <div 
          className={`d-flex flex-row justify-content-${message.userId!=user.id ? 'start': 'end'}`}
          style={{position: "relative"}}
        >
          {/*Avatar*/}
          {message.userId!=user.id && (newDay || firstInGroup) && (
            <Image
              roundedCircle
              src={message.user.avatar||Blank_Avatar}
              alt="avatar"
              style={{ width: "40px", height: "40px", position: "absolute"}}
              onError={(event)=>errorHandler(event)}
            />
          )}
          {/*senderName, message */}
          <div>
            <div
              className={`small p-2 mb-1 rounded-3 ${message.userId==user.id ? 'text-white bg-primary': ''}`}
              style={{ 
                backgroundColor: "#f5f6f7", 
                marginLeft: message.userId===user.id ? 'auto':"45px"
              }}
            >
              {message.userId!=user.id && (newDay || firstInGroup) && (
                <div className="senderName">{message.user.firstName}</div>
              )}
              <div>{message.message}</div>
            </div>
          </div>
          {/*SendTime*/}
          <div className="small ms-2 rounded-3 text-muted align-self-end">
            {moment(createdAt).format('hh:mm')}
          </div>
        </div>
      </div>
    )
  });


  return (
    <Card.Body 
      id="message_list-container-content"
      style={{overflowY: 'scroll'}}
    >
      {listItems}
      <div style={{ float:"left", clear: "both" }}
        ref={(el) => { setMessageEnd(el)}}>
      </div>
    </Card.Body>
  );
}

export default MessageListContent;