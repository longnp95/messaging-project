import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationContentHeader from './ConversationContentHeader';
import MessageListContent from './MessageListContent';
import MessageInputContainer from './MessageInputContainer';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const ConversationContentContainer = ({currentConversation, user, socket}) => {
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
    <Col xs={8} id='conversation_content-container-wrapper' className='g-0 border-left border-white '>
      <Card 
        id='conversation_content-card' 
        className='g-0 border-0' 
        style={{ borderRadius: "0" , height: "100vh"}}>
        <ConversationContentHeader
          currentConversation={currentConversation}
          user={user}
          roles={roles}
        />
        <MessageListContent
          socket={socket}
          currentConversation={currentConversation}
          user={user}
        />
        <MessageInputContainer
          currentConversation={currentConversation}
          user={user}
        />
      </Card>
    </Col>
  );
}

export default ConversationContentContainer;