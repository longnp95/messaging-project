import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationContentHeader from './ConversationContentHeader';
import MessageListContent from './MessageListContent';
import MessageInputContainer from './MessageInputContainer';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const ConversationContentContainer = ({currentConversation, user, socket, setCurrentConversation, setConversations, isAdding, setIsAdding, setUserToDisplay, setShowInfo, currentUserInfo, messages, setMessages}) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get('/role', {
      headers: {token: user.token}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data)
      setRoles(response.data.data.roles);
    }).catch((err)=>{
      console.log(err)
    })
  },[user])

  return (
    <Col sm={8} lg={9} id='conversation_content-container-wrapper' 
    className={`g-0 border-left border-white d-${currentConversation.length==0 ? 'none': 'block'} d-sm-block align-content-center`}
    >
      <Card 
        id='conversation_content-card' 
        className='g-0 border-0' 
        style={{ borderRadius: "0" , height: "100vh", height: "100dvh"}}>
        <ConversationContentHeader
          setConversations={setConversations}
          setCurrentConversation={setCurrentConversation}
          currentConversation={currentConversation}
          user={user}
          roles={roles}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          setUserToDisplay={setUserToDisplay}
          setShowInfo={setShowInfo}
        />
        <MessageListContent
          socket={socket}
          currentConversation={currentConversation}
          user={user}
          setUserToDisplay={setUserToDisplay}
          setShowInfo={setShowInfo}
          setConversations={setConversations}
          messages={messages}
          setMessages={setMessages}
        />
        <MessageInputContainer
          currentConversation={currentConversation}
          user={user}
          currentUserInfo={currentUserInfo}
        />
      </Card>
    </Col>
  );
}

export default ConversationContentContainer;