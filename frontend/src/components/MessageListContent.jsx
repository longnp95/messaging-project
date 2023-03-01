import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ImageLoader from '../services/ImageLoader.services';
import Dropdown from 'react-bootstrap/Dropdown';
import UserTooltip from './UserTooltip';
import axios from 'axios';
import moment from 'moment';


const MessageListContent = ({socket, currentConversation, user, setUserToDisplay, setShowInfo, 
  messages, setMessages, isEditing, setIsEditing, setEditingMessage, setEditingMessageText, 
  setConfirming, setConfirmMessage, setConfirmAction, members, reactions
}) => {
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

  const isLeader = members.find(el=>el.id==user.id && el.group_member.roleId==1)

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

  const deleteMessage = (message) => {
    axios.post('/conversation/deleteMessage',{
      messageId: message.id
    }, {
      headers: {token: user.token},
      params: {
        conversationId: message.conversationId
      }
    })
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data);
    }).catch((err)=>{
      console.log(err)
    })
  }

  const postReaction = async (message, reaction) => {
    const response = await axios.post('/conversation/reaction',{
      reactionId: reaction.id
    },{
      headers: {token: user.token},
      params: {
        conversationId: message.conversationId,
        messageId: message.id
      },
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
    } else {
      console.log(response.data.data);
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
            className={`d-flex flex-row justify-content-${message.userId!=user.id ? 'start': 'end'} my-1`}
            style={{position: "relative"}}
          >
            {/*Avatar*/}
            {message.userId!=user.id && (newDay || firstInGroup) && (
              <div style={{ position: "absolute"}} className="tooltipHover">
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
                className={`small px-2 py-1 rounded-3 ${message.userId==user.id ? 'text-white bg-primary': ''} ${message.status==0 ? 'text-muted bg-white border border-dark': ''}`}
                style={{ 
                  backgroundColor: "#f5f6f7", 
                  marginLeft: message.userId===user.id ? 'auto':"45px"
                }}
              >
                {message.userId!=user.id && (newDay || firstInGroup) && (
                  <div className="senderName">{[message.user.firstName, message.user.lastName].filter(e=>e).join(' ')}</div>
                )}
                {message.media && message.media.length>0 &&
                  <div>
                    {message.media.map((el) => {
                    return <div key={el.id}>
                      <a href={`http://${window.location.hostname}:8080${el.path}`} className="text-secondary" target="_blank">{el.originalName}</a>
                      
                    </div>
                  })}</div>
                }
                <div>{message.status!=0 ? message.message : "Message deleted"}</div>
                {/* Show reactions */}
                {(message.chat_reactions && message.chat_reactions.length>0) &&
                  <div 
                    className={`d-flex flex-row justify-content-${message.userId==user.id ? 'end' : 'start'}`}
                    
                  >
                    {reactions.map((reaction) => {
                      const chat_reactions = message.chat_reactions.filter((el) => el.reactionId === reaction.id);
                      return chat_reactions.length>0
                      ? <div key={reaction.id} className="rounded-pill bg-white px-1 d-flex flex-row flex-nowrap">
                          <span id="emoji-reaction" onClick={()=>postReaction(message, reaction)}>{reaction.emoji}</span>
                          {chat_reactions.map((chat_reaction)=>{
                            return <span key={chat_reaction.id} className='tooltipHover'>
                              <ImageLoader
                                className="seen-avatar"
                                roundedCircle
                                src={chat_reaction.user.avatar}
                                alt="avatar"
                                onClick={()=>{
                                  setUserToDisplay(chat_reaction.user);
                                  setShowInfo(true);
                                }}
                                style={{ width: "15px", height: "auto", aspectRatio: "1" }}
                              />
                              <UserTooltip
                                user={chat_reaction.user}
                                rightBorder={true}
                              />
                            </span>
                          })}
                      </div>
                      : <React.Fragment key={reaction.id}/>
                    })}
                  </div>
                }
              </div>
            </div>
            {message.status!=0 && 
            <Dropdown 
              className='d-flex flex-column justify-content-between'
              align={message.userId!=user.id ? 'start' : 'end'}
              style={{ order: `${message.userId!=user.id ? 1 : -1}`}}
            >
              <Dropdown.Toggle 
                id="dropdown-basic" 
                variant="info" 
                className={`p-0 align-self-${message.userId!=user.id ? 'start' : 'end'}`} 
                style={{backgroundColor: "transparent", color: "gray", borderColor: "transparent", borderWidth: "0"}}>
                <i className="material-icons" style={{ fontSize: "15px" }}>more_vert</i>
              </Dropdown.Toggle>

              <Dropdown.Menu className={`${message.userId == user.id || isLeader ? '':'bg-transparent border-0'}`}>
                {(reactions.length > 0)
                ? <div 
                  className='d-flex flex-row p-1 flex-nowrap bg-white border border-secondary rounded'
                  style={{position: "absolute", bottom: "105%", left: "0", right: "0"}}
                >
                  <div 
                    className='d-flex flex-row flex-grow-1 flex-shrink-1'
                    style={{ overflowX: 'hidden' }}
                  >
                    {reactions.map((reaction)=>{
                      return <Dropdown.Item 
                        key={reaction.id} 
                        className="p-0"
                        onClick={()=>postReaction(message, reaction)}
                      >{reaction.emoji}</Dropdown.Item>
                    })}
                  </div>
                  <div
                    id="dropdown-basic" 
                    variant="info" 
                    className={`p-0 tooltipHover`} 
                    style={{backgroundColor: "transparent", color: "gray", borderColor: "transparent", borderWidth: "0"}}>
                    <i className="material-icons" style={{ fontSize: "20px" }}>expand_less</i>
                    <div 
                      className='d-flex flex-row flex-wrap emojiTooltip border border-secondary justify-content-left align-items-center'
                    >
                      {reactions.map((reaction)=>{
                        return <Dropdown.Item 
                          key={reaction.id} 
                          className="p-0"
                          onClick={()=>postReaction(message, reaction)}
                          style={{ width: "auto" }}>{reaction.emoji}</Dropdown.Item>
                      })}
                    </div>
                  </div>
                </div>
                : <div className='text-truncate text muted'>No reaction loaded</div>
                }
                {(message.userId == user.id)&&
                  <Dropdown.Item onClick={() => {setEditingMessage(message); setEditingMessageText(message.message); setIsEditing(true)}}>
                    Edit Message
                  </Dropdown.Item>
                }
                {(message.userId == user.id || isLeader)&& 
                <Dropdown.Item 
                  onClick={() => {
                    setConfirmMessage('Are you sure to delete the message for everyone?'); 
                    setConfirmAction(()=>()=>deleteMessage(message)); 
                    setConfirming(true)
                  }}
                >
                  Delete Message
                </Dropdown.Item>}
              </Dropdown.Menu>
              {/*SendTime*/}
              <div className="small rounded-3 text-muted align-self-end px-2">
                {moment(createdAt).format('hh:mm')}
              </div>
            </Dropdown>}
          </div>
        }
        
        {/* Show people seen */}
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