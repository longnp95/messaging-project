import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import ConversationContentHeader from './ConversationContentHeader';
import MessageListContent from './MessageListContent';
import MessageInputContainer from './MessageInputContainer';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const ConversationContentContainer = ({currentConversation}) => {
  const messages = [
    {
      id: 1,
      userId: 1,
      content: 'First Message',
      user: {
        id: 1,
        firstName: 'Tuan',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 2,
      userId: 34,
      content: 'Second Message',
      user: {
        id: 34,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 3,
      userId: 1,
      content: 'Third Message',
      user: {
        id: 1,
        firstName: 'Tuan',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 4,
      userId: 23,
      content: 'Second Message',
      user: {
        id: 23,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 5,
      userId: 23,
      content: 'Third Message',
      user: {
        id: 23,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
  ];
  const userId = 1;
  return (
    <Col xs={8} id='conversation_content-container-wrapper' className='g-0 border-left border-white '>
      <Card 
        id='conversation_content-card' 
        className='g-0 border-0' 
        style={{ borderRadius: "0" , height: "100vh"}}>
        <ConversationContentHeader
          currentConversation={currentConversation}
        />
        <MessageListContent
          messages={messages}
          userId={userId}
        />
        <MessageInputContainer/>
      </Card>
    </Col>
  );
}

export default ConversationContentContainer;