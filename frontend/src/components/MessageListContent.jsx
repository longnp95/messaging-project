import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ImageLoader from '../services/ImageLoader.services';
import UserTooltip from './UserTooltip';
import axios from 'axios';
import moment from 'moment';


const MessageListContent = ({socket, currentConversation, user, setUserToDisplay, setShowInfo}) => {
  const [messages, setMessages] = useState([]);
  const [messageEnd, setMessageEnd] = useState();
  const [messageEndConversationId, setMessageEndConversationId] = useState();
  const [prevConversationId, setPrevConversationId] = useState();
  const [notSeenConversation, setNotSeenConversation] = useState({});
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

  const postLastSeen = async (user, conversationId) => {
    const response = await axios.post('/conversation/lastSeen',{},{
      headers: {token: user.token},
      params: {conversationId: conversationId},
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
    } else {
      console.log(response.data.data);
    }
  }

  const handleVisibilityChange = async () => {
    if (!document.hidden && currentConversation && notSeenConversation[currentConversation.id]) {
      await postLastSeen(user, currentConversation.id);
      setNotSeenConversation(prevList => {return {...prevList, [currentConversation.id]: true}});
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  })

  useEffect(() => {
    if (!document.hidden && currentConversation && notSeenConversation[currentConversation.id]) {
      postLastSeen(user, currentConversation.id).then(() => {
        setNotSeenConversation(prevList => {return {...prevList, [currentConversation.id]: true}});
      });
    }
  },[currentConversation, user])
  
  useEffect(() => {
    console.log(`listening message ${currentConversation.id}`);
    socket.on("message", async ({action, data}) => {
      console.log(data);
      switch (action) {
        case 'newMessage': 
          setMessages(prevMessages => {
            let conversation = null
            if (data.chat.conversationId) conversation = prevMessages[data.chat.conversationId];
            if (!conversation) {
              console.log('Not loaded yet');
              return prevMessages;
            }
            console.log(conversation);
            const existed = conversation.find(message => message.id == data.chat.id);
            if (!existed){
              console.log('new message');
              return {...prevMessages, [data.chat.conversationId]:[...(prevMessages[data.chat.conversationId]||[]), data.chat]}
            }
            return prevMessages;
          });
          break
        case 'update':
          setMessages(prevMessages => {
            console.log(data);
            console.log(prevMessages);
            let conversation = null
            if (!data.chat.conversationId) return prevMessages;
            conversation = prevMessages[data.chat.conversationId];
            if (!conversation) {
              console.log('Not loaded yet');
              return prevMessages;
            }
            console.log(conversation);
            const existedIndex = conversation.findIndex(message => message.id == data.chat.id);
            if (existedIndex==-1){
              console.log('new message');
              return {...prevMessages, [data.chat.conversationId]:[...(prevMessages[data.chat.conversationId]||[]), data.chat]}
            } else {
              return {...prevMessages, 
                [data.chat.conversationId]:prevMessages[data.chat.conversationId].map((message => {
                  if (message.id == data.chat.id) return data.chat;
                  return message;
                }))
              }
            }
          });
        default:
      }
      if (!document.hidden && data.chat && currentConversation && data.chat.conversationId == currentConversation.id) {
        postLastSeen(user, currentConversation.id);
      } else {
        if (data.chat && data.chat.conversationId)setNotSeenConversation(prevList => {return {...prevList, [data.chat.conversationId]: true}});
      }
    });

    return () => {
      socket.off("message");
    }
  }, [socket, currentConversation, user, messageEnd]);

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