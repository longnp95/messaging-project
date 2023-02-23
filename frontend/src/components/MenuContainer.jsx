import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Cookies from 'universal-cookie';

const MenuContainer = ({setShowOffcanvas, setIsCreating, setIsDMing, setUserToDisplay, setShowInfo, currentUserInfo}) => {
  const Logout = () => {
    const cookie = new Cookies();
    cookie.remove('token');
    window.location.reload();
  }

  return (
    <>
      <Nav className="justify-content-end flex-grow-1 px-0">
        
        <Navbar.Text 
          onClick={()=>{
            setUserToDisplay(currentUserInfo);
            setShowInfo(true);
            setShowOffcanvas(false);
          }}
        >My Profile</Navbar.Text>
       
        <Navbar.Text onClick={() => {setShowOffcanvas(false); setIsCreating(true)}}>Create Group</Navbar.Text>
        
        <Navbar.Text onClick={() => {setShowOffcanvas(false); setIsDMing(true)}}>All Users</Navbar.Text>
       
        <Navbar.Text onClick={Logout}>Log Out</Navbar.Text>
      </Nav>

    </>
  )
}

export default MenuContainer;