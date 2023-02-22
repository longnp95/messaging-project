import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Cookies from 'universal-cookie';

const MenuContainer = ({setShowOffcanvas, setIsCreating, setIsDMing}) => {
  const Logout = () => {
    const cookie = new Cookies();
    cookie.remove('token');
    window.location.reload();
  }

  return (
    <>
      <Nav className="justify-content-end flex-grow-1 px-2">
        {/*
        <Navbar.Text >Current User</Navbar.Text>
        */}
        <Navbar.Text onClick={() => {setShowOffcanvas(false); setIsCreating(true)}}>Create Group</Navbar.Text>
        
        <Navbar.Text onClick={() => {setShowOffcanvas(false); setIsDMing(true)}}>All Users</Navbar.Text>
       
        <Navbar.Text onClick={Logout}>Log Out</Navbar.Text>
      </Nav>

    </>
  )
}

export default MenuContainer;