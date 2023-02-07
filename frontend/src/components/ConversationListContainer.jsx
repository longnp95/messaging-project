import React, { useState } from 'react';
import ConversationSearch from './ConversationSearch';
import ConversationListContent from './ConversationListContent';
import LeftNavBar from './LeftNavBar';
import Col from 'react-bootstrap/Col';

const ConversationListContainer = ({isCreating, setIsCreating, conversations, setConversations, setCurrentConversation, currentConversation, user}) => {
  const [searchText, setSearchText] = useState('');
  return (
    <Col xs={4} id="conversation_list-container" className="g-0 border-right bg-light">
      <LeftNavBar 
        setSearchText={setSearchText}
        user={user}
      />
      <ConversationListContent
        conversations={conversations}
        setConversations={setConversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        user={user}
      />
    </Col>
  )
  
}

export default ConversationListContainer;