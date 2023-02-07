import { useState, useEffect } from 'react';
import axios from "axios";

const ConversationListContent = ({conversations, setConversations, setCurrentConversation, user}) => {
  useEffect(() => {
    axios.get('/conversation', {
      headers: {token: user.token},
      params: {userId: user.userId}})
    .then((response)=>{
      if (response.data.error.status == 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      setConversations(response.data.data.conversations);
      console.log(conversations);
    }).catch((err)=>{
      console.log(err)
    })
  },[])
  const handleClick = (conversation) => {
    console.log('clicking');
    setCurrentConversation(conversation);
    return;
  }
  const conversationItems = conversations.map((conversation) =>
    <div
      key={conversation.conversationId}
      id="conversation-item-container"
      onClick={() => handleClick(conversation)}
    >
      <p id='conversation-name'>
        {conversation.name}
      </p>
      <p id='conversation-preview'>
        {conversation.last_message}
      </p>
    </div>
  );

  console.log('returning')
  return (
    <div
      id="conversation-item-container"
    >
      <p id='conversation-name'>
        conversationName
      </p>
      <p id='conversation-preview'>
        conversationPreview...
      </p>
    </div>      
  )
  return (
    <div id="conversation_list-container-content">
      {conversationItems}
    </div>
  );
}

export default ConversationListContent;