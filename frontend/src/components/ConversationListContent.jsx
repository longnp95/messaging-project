import { useState, useEffect } from 'react';
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import ImageLoader from '../services/ImageLoader.services';

const ConversationListContent = ({socket, conversations, setConversations, setCurrentConversation, user}) => {
  useEffect(() => {
    console.log('getting conversations list');
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
    
  },[user])

  useEffect(() => {
    console.log('listening conversation socket')
    socket.on("conversation", ({action, data}) => {
      switch (action) {
        case 'create': 
          setConversations(prevConversations =>{
            const existed = prevConversations.find(conversation => conversation.id == data.conversation.id);
            if (!existed) return [...prevConversations, data.conversation];
            return prevConversations;
          });
          break
        case 'update':
          setConversations(prevConversations =>{
            const nextConversations = prevConversations.map(conversation => {
              if (conversation.id == data.conversation.id) {
                return data.conversation;
              } else {
                return conversation;
              }
            });
            return nextConversations;
          });
          break
        default:
      }
    });

    return () => {
      socket.off("conversation");
    }
  }, [socket]);

  const handleClick = (conversation) => {
    setCurrentConversation(conversation);
    return;
  }
  const conversationItems = conversations
  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  .map((conversation) =>
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
        <div id='conversation-name'>
          {conversation.name}
        </div>
        <div id='conversation-preview'
          className='text-truncate'
        >
          {conversation.last_message}
        </div>
      </Col>
    </Row>
  );

  return (
    <div id="conversation_list-container-content"
    style={{overflowY: 'scroll'}}
    >
      {conversationItems}
    </div>
  );
}

export default ConversationListContent;