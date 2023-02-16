import React, { useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image';
import Blank_Avatar from '../public/Blank-Avatar.png';
import AddMemberForm from './AddMemberForm';
import MemberList from './MemberList';
import ConfirmationModal from './ConfirmationModal';

const ConversationContentHeader = ({currentConversation, user, roles, setCurrentConversation, setConversations}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('Are you sure?');
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const deleteConversation = () => {
    console.log("Delete conversation");
  }
  console.log(currentConversation);
  const leaveConversation = () => {
    axios.post('/conversation/leaveGroup',{}, {
      headers: {token: user.token},
      params: {conversationId: currentConversation.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data);
      setCurrentConversation([]);
      setConversations(prevConversations => prevConversations.filter(conversation => conversation.id!=currentConversation.id));
    }).catch((err)=>{
      console.log(err)
    })
  }
  
  const cancelConfirm = () => {
    setConfirmAction(() => () => {});
    setConfirmMessage('Are you sure?');
  }

  const errorHandler = (event) => {
    event.currentTarget.src = Blank_Avatar;
  };
  let nameToDisplay = currentConversation.name;
  let avatarToDisplay = currentConversation.avatar;
  if (currentConversation.typeId==1) {
    if (currentConversation.partnerId != user.id && currentConversation.partner) {
      nameToDisplay = [currentConversation.partner.firstName, currentConversation.partner.lastName].join(' ');
      avatarToDisplay = currentConversation.partner.avatar;
    } else if (currentConversation.creatorId != user.id && currentConversation.creator) {
      nameToDisplay = [currentConversation.creator.firstName, currentConversation.creator.lastName].join(' ');
      avatarToDisplay = currentConversation.creator.avatar;
    }
  }
  return (
    <Card.Header id="conversation_content-header-wrapper" 
      className="d-flex justify-content-between align-items-center p-3 g-0 bg-info text-white"
      style={{ borderRadius: "0" }}
    >
      <i id="currentConversationToggle" className="material-icons d-sm-none" onClick={()=>setCurrentConversation([])}>arrow_back</i>
      <Image 
        roundedCircle alt="Avatar" 
        src={avatarToDisplay||Blank_Avatar} 
        style={{ width: "30px", height: "auto", aspectRatio: "1" }}
        className="d-none d-sm-block"
        onError={(event)=>errorHandler(event)}
      />
      <p className="mb-0 fw-bold">{nameToDisplay}</p>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" variant="info" className='p-0'>
          <i className="material-icons">more_vert</i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {(currentConversation.typeId!=1)&&
            <Dropdown.Item onClick={() => setIsAdding(true)}>Add Member</Dropdown.Item>
          }
          <Dropdown.Item onClick={() => setShowMembers(true)}>Manage Conversation</Dropdown.Item>
          {(currentConversation.typeId!=1)&&
            <Dropdown.Item 
              onClick={() => {
                setConfirmMessage('Are you sure to leave group?'); 
                setConfirmAction(()=>leaveConversation); 
                setConfirming(true)
              }}
            >
              Leave Group
            </Dropdown.Item>
          }
        </Dropdown.Menu>
      </Dropdown>
      <AddMemberForm
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        currentConversation={currentConversation}
        user={user}
      />
      <MemberList 
        showMembers={showMembers}
        setShowMembers={setShowMembers}
        setIsAdding={setIsAdding}
        currentConversation={currentConversation}
        user={user}
        roles={roles}
        setConfirmMessage={setConfirmMessage}
        setConfirmAction={setConfirmAction}
        setConfirming={setConfirming}
        setConversations={setConversations}
        setCurrentConversation={setCurrentConversation}
      />
      <ConfirmationModal
        message={confirmMessage}
        show={confirming}
        setShow={setConfirming}
        confirmAction={confirmAction}
        cancelAction={cancelConfirm}
      />
    </Card.Header>
  )
}

export default ConversationContentHeader