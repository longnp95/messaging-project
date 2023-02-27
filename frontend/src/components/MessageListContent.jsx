import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ImageLoader from '../services/ImageLoader.services';
import UserTooltip from './UserTooltip';
import axios from 'axios';
import moment from 'moment';


const MessageListContent = ({socket, currentConversation, user, setUserToDisplay, setShowInfo, messages, setMessages}) => {
  const [messageEnd, setMessageEnd] = useState();
  const [messageEndConversationId, setMessageEndConversationId] = useState();
  const [prevConversationId, setPrevConversationId] = useState();
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
  },[currentConversation, user, messages]);

  useEffect(() => {
    if (messageEnd && 
    messageEndConversationId &&
    messageEndConversationId === currentConversation.id) {
      if (prevConversationId !== currentConversation.id) {
        messageEnd.scrollIntoView(/* { behavior: "smooth" } */);
        setPrevConversationId(currentConversation.id);
      } else {
        const messageEndRect = messageEnd.getBoundingClientRect();
        const messagesContainerRect = document.getElementById('message_list-container-content').getBoundingClientRect();
        if (messageEndRect.top < messagesContainerRect.bottom && messageEndRect.bottom > messagesContainerRect.bottom) messageEnd.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },[messageEnd, currentConversation, messageEndConversationId, prevConversationId])

  const isFirstOfSenderGroup = (message, index) => {
    return index===0 || messages[currentConversation.id][index-1].userId !== message.userId
  }

  const isLastMessage = (message, index) => {
    return index == messages[currentConversation.id].length - 1;
  }

  const isNewDay = (message, index) => {
    if (index===0) return true;
    const date1 = new Date(messages[currentConversation.id][index-1].createdAt);
    const date2 = new Date(message.createdAt);
    if (date1.toDateString() === date2.toDateString()){
      return false;
    } else {
      return true;
    }
  }

  const isToday = (date) => {
    const now = new Date();
    if (now.toDateString() === date.toDateString()){
      return true;
    } else {
      return false;
    }
  }

  if (!(messages[currentConversation.id]&&messages[currentConversation.id].length)) return (
    <Card.Body 
      id="message_list-container-content"
      style={{overflowY: 'auto'}}
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
    const lastMessage = isLastMessage(message, index);
    return (
      <div 
        id="message_list-container-content-item-wrapper"
        className='message-wrapper' 
        key={message.id}
        ref={(el) => { if (lastMessage) {setMessageEnd(el); setMessageEndConversationId(message.conversationId)}}}
      >
        {/*Display date*/}
        {newDay && (
          <div className="divider d-flex flex-row justify-content-center mb-4">
            <p
              className="text-center mx-3 mb-0"
              style={{ color: "#a2aab7" }}
            >
              {isToday(createdAt)? "Today" : moment(createdAt).format("dddd, MMMM Do YYYY")}
            </p>
          </div>
        )}
        {/*Display [avatar], [senderName], message, sendTime*/}
        {/*Check if system message (no user) */}
        {(!message.user)
        ? <div className="divider d-flex flex-row justify-content-center mb-4">
            <p
              className="text-center mx-3 mb-0"
              style={{ color: "#a2aab7" }}
            >
              {message.message}
            </p>
          </div>
        : <div 
            className={`d-flex flex-row justify-content-${message.userId!=user.id ? 'start': 'end'}`}
            style={{position: "relative"}}
          >
            {/*Avatar*/}
            {message.userId!=user.id && (newDay || firstInGroup) && (
              <div style={{ position: "absolute" }} className="tooltipHover">
                <ImageLoader
                  roundedCircle
                  src={message.user.avatar}
                  alt="avatar"
                  style={{ width: "40px", height: "auto", aspectRatio: "1"}}
                  onClick={()=>{
                    setUserToDisplay(message.user);
                    setShowInfo(true);
                  }}
                />
                <UserTooltip
                  user={message.user}
                />
              </div>
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
                  <div className="senderName">{[message.user.firstName, message.user.lastName].filter(e=>e).join(' ')}</div>
                )}
                {message.media && message.media.length &&
                  <div>{message.media.map((el) => {
                    return <div key={el.id}>
                      <a href={`http://${window.location.hostname}:8080${el.path}`} className="text-dark" target="_blank">{el.originalName}</a>
                      
                    </div>
                  })}</div>
                }
                <div>{message.message}</div>
              </div>
            </div>
            {/*SendTime*/}
            <div className="small ms-2 rounded-3 text-muted align-self-end">
              {moment(createdAt).format('hh:mm')}
            </div>
          </div>
        }
        {message.group_members && (
          <div className='d-flex flex-row justify-content-end'>
            {message.group_members.map((member) => {
              return member.userId == user.id
              ? <React.Fragment key={member.id}/>
              : <div key={member.id} className='tooltipHover'>
                <ImageLoader
                  className="seen-avatar"
                  roundedCircle
                  src={member.user.avatar}
                  alt="avatar"
                  onClick={()=>{
                    setUserToDisplay(member.user);
                    setShowInfo(true);
                  }}
                  style={{ width: "15px", height: "auto", aspectRatio: "1" }}
                />
                <UserTooltip
                  user={member.user}
                  rightBorder={true}
                />
              </div>
              
            })}
          </div>
          
        )}
      </div>
    )
  });


  return (
    <Card.Body 
      id="message_list-container-content"
      style={{overflowY: 'scroll', overflowX: 'hidden'}}
    >
      {listItems}
    </Card.Body>
  );
}

export default MessageListContent;