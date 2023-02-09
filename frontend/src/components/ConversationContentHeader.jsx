import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image';
import Blank_Avatar from '../public/Blank-Avatar.png';
import AddMemberForm from './AddMemberForm';

const ConversationContentHeader = ({currentConversation, user}) => {
  const [isCreating, setIsCreating] = React.useState(false);
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
        src={currentConversation.avatar} 
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
          <Dropdown.Item onClick={() => setIsCreating(true)}>Add Member</Dropdown.Item>
          <Dropdown.Item >Another action</Dropdown.Item>
          <Dropdown.Item >Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <AddMemberForm 
        onHide={() => setIsCreating(false)}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        user={user}
      />
    </Card.Header>
  )
}

export default ConversationContentHeader