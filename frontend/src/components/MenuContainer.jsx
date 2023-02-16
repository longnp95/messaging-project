import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Cookies from 'universal-cookie';
import NewConversationForm from './NewConversationForm';
import DirectMessage from './DirectMessage';

const MenuContainer = ({menuToggle, user, setCurrentConversation, conversations}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDMing, setIsDMing] = useState(false);
  
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
        
        <Navbar.Text onClick={() => setIsDMing(true)}>Direct Message</Navbar.Text>
       
        <Navbar.Text onClick={Logout}>Log Out</Navbar.Text>
      </Nav>

      <NewConversationForm 
        onHide={() => setIsCreating(false)}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        user={user}
      />

      <DirectMessage 
        onHide={() => setIsDMing(false)}
        isDMing={isDMing}
        setIsDMing={setIsDMing}
        user={user}
        setCurrentConversation={setCurrentConversation}
        conversations={conversations}
      />
    </>
  )
}

export default MenuContainer;