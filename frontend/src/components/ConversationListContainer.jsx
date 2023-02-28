import React, { useState, useContext, useEffect } from 'react';
import ConversationListContent from './ConversationListContent';
import LeftNavBar from './LeftNavBar';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

const ConversationListContainer = ({socket, isAdding, setIsAdding, conversations, setConversations, 
  setCurrentConversation, currentConversation, user, setUserToDisplay, 
  setShowInfo, currentUserInfo, setReactions}) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('/reaction', {
      headers: {token: user.token}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data)
      setReactions(response.data.data.reactions);
    }).catch((err)=>{
      console.log(err)
    })
  },[user])

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
        setUserToDisplay={setUserToDisplay}
        setShowInfo={setShowInfo}
        currentUserInfo={currentUserInfo}
      />
      <ConversationListContent
        setSearchText={setSearchText}
        searchText={searchText}
        socket={socket}
        conversations={conversations}
        setConversations={setConversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        setUserToDisplay={setUserToDisplay}
        setShowInfo={setShowInfo}
        user={user}
      />
    </Col>
  )
  
}

export default ConversationListContainer;