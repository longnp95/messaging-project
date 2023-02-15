import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image';
import Blank_Avatar from '../public/Blank-Avatar.png';
import AddMemberForm from './AddMemberForm';
import MemberList from './MemberList';
import ConfirmationModal from './ConfirmationModal';

const ConversationContentHeader = ({currentConversation, user, roles}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deleteConversation = () => {
    console.log("Delete conversation");
  }
  const errorHandler = (event) => {
    event.currentTarget.src = Blank_Avatar;
  };
  return (
    <Card.Header id="conversation_content-header-wrapper" 
      className="d-flex justify-content-between align-items-center p-3 g-0 bg-info text-white"
      style={{ borderRadius: "0" }}
    >
      <i className="material-icons d-md-none">arrow_back</i>
      <Image 
        roundedCircle alt="Avatar" 
        src={currentConversation.avatar||Blank_Avatar} 
        style={{ width: "30px", height: "auto", aspectRatio: "1" }}
        className="d-none d-md-block"
        onError={(event)=>errorHandler(event)}
      />
      <p className="mb-0 fw-bold">{currentConversation.name}</p>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" variant="info" className='p-0'>
          <i className="material-icons">more_vert</i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setIsAdding(true)}>Add Member</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowMembers(true)}>Show Members</Dropdown.Item>
          <Dropdown.Item >Placeholder</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <AddMemberForm 
        onHide={() => setIsAdding(false)}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        currentConversation={currentConversation}
        user={user}
      />
      <MemberList 
        onHide={() => setShowMembers(false)}
        showMembers={showMembers}
        setShowMembers={setShowMembers}
        setIsAdding={setIsAdding}
        currentConversation={currentConversation}
        user={user}
        roles={roles}
      />
    </Card.Header>
  )
}

export default ConversationContentHeader