import { useState, useEffect } from 'react';
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import ImageLoader from '../services/ImageLoader.services';

const ConversationListContent = ({conversations, setConversations, setCurrentConversation, user}) => {
  useEffect(() => {
    axios.get('/conversation', {
      headers: {token: user.token},
      params: {userId: user.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      setConversations(response.data.data.conversations);
    }).catch((err)=>{
      console.log(err)
    })
  },[])
  const handleClick = (conversation) => {
    setCurrentConversation(conversation);
    return;
  }
  const conversationItems = conversations.map((conversation) =>
    <Row
      key={conversation.id}
      id="conversation-item-container"
      onClick={() => handleClick(conversation)}
      className="mx-0 py-1 ps-1 flex-nowrap"
    >
      <Col className="g-0 border-right">
        <ImageLoader
          roundedCircle alt="Avatar" 
          src={conversation.avatar}
          style={{ width: "50px", height: "auto", aspectRatio: "1"}}
        />
      </Col>
      <Col xs={8} className="ms-1 flex-grow-1 px-0 px-sm-1">
        <p id='conversation-name'>
          {conversation.name}
        </p>
        <p id='conversation-preview'>
          {conversation.last_message}
        </p>
      </Col>
    </Row>
  );

  return (
    <div id="conversation_list-container-content">
      {conversationItems}
    </div>
  );
}

export default ConversationListContent;