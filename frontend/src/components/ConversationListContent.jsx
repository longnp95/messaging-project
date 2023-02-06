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
      id="conversation_list-container-content-item-wrapper"
      onClick={() => handleClick(conversation)}
    >
      <p>
        {conversation.conversationName}
      </p>
    </div>
  );

  console.log('returning')
  return (
    <div
      id="conversation_list-container-content-item-wrapper"
    >
      <p>
        conversationName
      </p>
      <p>
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