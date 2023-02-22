import React, { useState, useContext, useEffect } from 'react';
import ConversationSearch from './ConversationSearch';
import ConversationListContent from './ConversationListContent';
import LeftNavBar from './LeftNavBar';
import Col from 'react-bootstrap/Col';

const ConversationListContainer = ({socket, isAdding, setIsAdding, conversations, setConversations, setCurrentConversation, currentConversation, user}) => {
  const [searchText, setSearchText] = useState('');

  return (
    <Col sm={4} lg={3} id="conversation_list-container" 
    className={`flex flex-column g-0 border-right bg-light d-${currentConversation.length==0 ? 'flex': 'none'} d-sm-flex`}
    style={{ borderRadius: "0" , height: "100vh", height: "100dvh"}}
    >
      <LeftNavBar 
        setSearchText={setSearchText}
        user={user}
        conversations={conversations}
        setCurrentConversation={setCurrentConversation}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
      />
      <ConversationListContent
        setSearchText={setSearchText}
        searchText={searchText}
        socket={socket}
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