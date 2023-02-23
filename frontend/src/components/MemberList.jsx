import axios from "axios";
import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ImageLoader from "../services/ImageLoader.services";
import Dropdown from "react-bootstrap/Dropdown";

const MemberList = ({user, currentConversation, members, setMembers, showMembers, setShowMembers, setIsAdding, roles, setShowInfo, setUserToDisplay}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const listSuggestions = members.map(member => {
    let role = "N/A"
    const roleItem = roles.find(el => el.id == member.group_member.roleId);
    if (roleItem) role = roleItem.name;
    if (!member.username.toLowerCase().includes(searchQuery.toLowerCase())
      && ![member.firstName, member.lastName].filter(e=>e).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    ) return <></>;
    return <Row
      key={member.group_member.id}
      id="suggestion-item-container"
      className="mx-0 py-1 ps-1 flex-nowrap"
      onClick={()=>{
        setUserToDisplay(member);
        setShowInfo(true);
        setShowMembers(false);
      }}
    >
      <Col xs="auto" className="g-0 border-right">
        <ImageLoader
          roundedCircle alt="Avatar" 
          src={member.avatar}
          style={{ width: "50px", height: "auto", aspectRatio: "1"}}
        />
      </Col>
      <Col className="me-md-2 ms-1 flex-grow-1 px-0 px-sm-1">
        <div id='conversation-name'>
          {[member.firstName, member.lastName].filter(e=>e).join(' ')}
        </div>
        <div id='conversation-preview'
          className='text-truncate'
        >
          {'@'+member.username}
        </div>
      </Col>
      {(currentConversation.typeId!=1)&&
        <Col xs="auto" className="ms-2 px-0 px-sm-1 align-self-center">
          <div id='Role'>
            {role}
          </div>
        </Col>
      } 
    </Row>
  })
  
  return (
    <Modal
      onHide={() => {setShowMembers(false); setSearchQuery(''); setMembers([])}}
      show={showMembers}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <div className= "d-flex flex-column"
        style={{height: 'auto'}}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {`${currentConversation.name}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        <form className='d-flex flex-column'
          style={{height: '70vh'}}
          onSubmit={(e)=>e.preventDefault()}
        >
          <Form.Group controlId="memberId" onChange={handleChange}>
            <Form.Control type="text" placeholder="Search for username" autoComplete="off"/>
          </Form.Group>
          <div className="flex-grow-1" style={{overflowY: 'auto'}}>
            {listSuggestions}
          </div>
          {(currentConversation.typeId!=1)&&
            <Button variant="primary" onClick={()=>{setIsAdding(true); setShowMembers(false)}}>
              Add Member
            </Button>
          }
        </form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default MemberList;