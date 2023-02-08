import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import ConversationContentHeader from './ConversationContentHeader';
import MessageListContent from './MessageListContent';
import MessageInputContainer from './MessageInputContainer';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const ConversationContentContainer = ({currentConversation, user}) => {
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
      userId: 2,
      content: 'Second Message',
      user: {
        id: 2,
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
      userId: 2,
      content: 'Second Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 2352,
      userId: 2,
      content: 'Third Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 4563454,
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
      id: 23245,
      userId: 2,
      content: 'Second Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 334,
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
      id: 1245634,
      userId: 2,
      content: 'Second Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 224541,
      userId: 2,
      content: 'Third Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 245673245,
      userId: 2,
      content: 'Second Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 357434,
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
      id: 12345687,
      userId: 2,
      content: 'Second Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
    {
      id: 8567456,
      userId: 2,
      content: 'Third Message',
      user: {
        id: 2,
        firstName: 'Hung',
        lastName:'',
        avatar:''
      }
    },
  ];
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