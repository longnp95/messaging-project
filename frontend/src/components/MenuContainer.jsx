import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Cookies from 'universal-cookie';
import NewConversationForm from './NewConversationForm';

const MenuContainer = ({menuToggle, user, setCreateType, setCreateTypeId, createTypeId}) => {
  const [isCreating, setIsCreating] = React.useState(false);
  
  const Logout = () => {
    const cookie = new Cookies();
    cookie.remove('token');
    window.location.reload();
  }

  return (
    <>
      <Nav className="justify-content-end flex-grow-1 px-0">
        <Nav.Link >Current User</Nav.Link>
        <Nav.Link onClick={() => setIsCreating(true)}>Create Group</Nav.Link>
        <Nav.Link >Direct Message</Nav.Link>
        <Nav.Link onClick={Logout}>Log Out</Nav.Link>
      </Nav>

      <NewConversationForm 
        onHide={() => setIsCreating(false)}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        user={user}
      />
    </>
  )
}

export default MenuContainer;