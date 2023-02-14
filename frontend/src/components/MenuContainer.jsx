import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
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
        {/*
        <Navbar.Text >Current User</Navbar.Text>
        */}
        <Navbar.Text onClick={() => setIsCreating(true)} aria-controls={`offcanvasNavbar-expand-false`}>Create Group</Navbar.Text>
        {/*
        <Navbar.Text >Direct Message</Navbar.Text>
        */}
        <Navbar.Text onClick={Logout}>Log Out</Navbar.Text>
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