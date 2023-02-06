import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import ConversationContentHeader from './ConversationContentHeader';
import MessageListContent from './MessageListContent';
import MessageInputContainer from './MessageInputContainer';

const ConversationContentContainer = ({currentConversation}) => {
  const messages = [
    {
      messageId: 1,
      senderId: 1,
      senderName: 'Tuan',
      content: 'First Message'
    },
    {
      messageId: 2,
      senderId: 34,
      senderName: 'Hung',
      content: 'Second Message'
    },
    {
      messageId: 3,
      senderId: 34,
      senderName: 'Hung',
      content: 'Third Message'
    },
  ];
  const userId = 11;
  return (
    <div id='conversation_content-container-wrapper' className="col-md-8">
      <ConversationContentHeader
        currentConversation={currentConversation}
      />
      <MessageListContent
        messages={messages}
        userId={userId}
      />

      <MessageInputContainer/>
    </div>
  );
}

export default ConversationContentContainer;