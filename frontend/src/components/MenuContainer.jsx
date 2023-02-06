import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import NewConversationForm from './NewConversationForm';

const MenuContainer = ({menuToggle, user, setCreateType, setCreateTypeId, createTypeId}) => {
  const [isCreating, setIsCreating] = React.useState(false);
  
  return (
    <>
      <Nav className="justify-content-end flex-grow-1 px-0">
        <Nav.Link href="#action1">Current User</Nav.Link>
        <Nav.Link href="#action2" onClick={() => setIsCreating(true)}>Create Group</Nav.Link>
        <Nav.Link href="#action3">Direct Message</Nav.Link>
        <Nav.Link href="#action4">Log Out</Nav.Link>
      </Nav>

      <NewConversationForm 
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        user={user}
      />
    </>
  )
}

export default MenuContainer;