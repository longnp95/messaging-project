import React, { useState } from 'react';
import ConversationSearch from './ConversationSearch';
import ConversationListContent from './ConversationListContent';

const ConversationListContainer = ({isCreating, setIsCreating, setMenuToggle, menuToggle, setCurrentConversation, currentConversation, user}) => {
  const menuOn = () => {
    setMenuToggle('menu-on');
  }
  const [searchText, setSearchText] = useState('');
  return (
    <div id="conversation_list-container" className="col-md-4 border-right">
      <div id="conversation_list-container-topbar">
        <i className="material-icons menu" onClick={menuOn}>menu</i>
        <ConversationSearch setSearchText={setSearchText}/>
      </div>
      <p>{searchText}</p>
      <ConversationListContent
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        user={user}
      />
    </div>
  )
  
}

export default ConversationListContainer;