import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationContentHeader from './ConversationContentHeader';
import MessageListContent from './MessageListContent';
import MessageInputContainer from './MessageInputContainer';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ConfirmationModal from './ConfirmationModal';

const ConversationContentContainer = ({currentConversation, user, socket, setCurrentConversation, 
  setConversations, isAdding, setIsAdding, setUserToDisplay, setShowInfo, currentUserInfo, 
  messages, setMessages, reactions}) => {

  const [roles, setRoles] = useState([]);
  const [editingMessage, setEditingMessage] = useState();
  const [editingMessageText, setEditingMessageText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('Are you sure?');
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get('/conversation/getMember', {
      headers: {token: user.token},
      params: {conversationId: currentConversation.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      setMembers(response.data.data.conversation.users);
    }).catch((err)=>{
      console.log(err)
    })
  },[currentConversation,user,isAdding,showMembers])

  useEffect(() => {
    axios.get('/role', {
      headers: {token: user.token}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data)
      setRoles(response.data.data.roles);
    }).catch((err)=>{
      console.log(err)
    })
  },[user])

  const cancelConfirm = () => {
    setConfirmAction(() => () => {});
    setConfirmMessage('Are you sure?');
  }

  return (
    <Col sm={8} lg={9} id='conversation_content-container-wrapper' 
    className={`g-0 border-left border-white d-${currentConversation.length==0 ? 'none': 'block'} d-sm-block align-content-center`}
    >
      <Card 
        id='conversation_content-card' 
        className='g-0 border-0' 
        style={{ borderRadius: "0" , height: "100vh", height: "100dvh"}}>
        <ConversationContentHeader
          setConversations={setConversations}
          setCurrentConversation={setCurrentConversation}
          currentConversation={currentConversation}
          user={user}
          roles={roles}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          setUserToDisplay={setUserToDisplay}
          setShowInfo={setShowInfo}
          confirming={confirming}
          setConfirming={setConfirming}
          confirmMessage={confirmMessage}
          setConfirmMessage={setConfirmMessage}
          confirmAction={confirmAction}
          setConfirmAction={setConfirmAction}
          showMembers={showMembers}
          setShowMembers={setShowMembers}
          members={members}
          setMembers={setMembers}
        />
        <MessageListContent
          socket={socket}
          currentConversation={currentConversation}
          user={user}
          setUserToDisplay={setUserToDisplay}
          setShowInfo={setShowInfo}
          setConversations={setConversations}
          messages={messages}
          setMessages={setMessages}
          editingMessage={editingMessage}
          setEditingMessage={setEditingMessage}
          setEditingMessageText={setEditingMessageText}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          confirming={confirming}
          setConfirming={setConfirming}
          confirmMessage={confirmMessage}
          setConfirmMessage={setConfirmMessage}
          confirmAction={confirmAction}
          setConfirmAction={setConfirmAction}
          members={members}
          reactions={reactions}
        />
        <MessageInputContainer
          currentConversation={currentConversation}
          user={user}
          currentUserInfo={currentUserInfo}
          editingMessage={editingMessage}
          setEditingMessage={setEditingMessage}
          editingMessageText={editingMessageText}
          setEditingMessageText={setEditingMessageText}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </Card>
      <ConfirmationModal
        message={confirmMessage}
        show={confirming}
        setShow={setConfirming}
        confirmAction={confirmAction}
        cancelAction={cancelConfirm}
      />
    </Col>
  );
}

export default ConversationContentContainer;