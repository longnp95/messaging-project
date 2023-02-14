import axios from "axios";
import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ImageLoader from "../services/ImageLoader.services";

const MemberList = ({user, currentConversation, showMembers, setShowMembers, setIsAdding}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!showMembers) return;
    setMembers([]);
    axios.get('/conversation/getMember', {
      headers: {token: user.token},
      params: {conversationId: currentConversation.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data)
      setMembers(response.data.data.conversation.users);
    }).catch((err)=>{
      console.log(err)
    })
  },[currentConversation,user,showMembers])

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const listSuggestions = members.map(member => {
    if (!member.username.toLowerCase().includes(searchQuery.toLowerCase())
      && ![member.firstName, member.lastName].filter(e=>e).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    ) return <></>;
    return <Row
      key={member.id}
      id="suggestion-item-container"
      className="mx-0 py-1 ps-1 flex-nowrap"
    >
      <Col className="g-0 border-right">
        <ImageLoader
          roundedCircle alt="Avatar" 
          src={member.avatar}
          style={{ width: "50px", height: "auto", aspectRatio: "1"}}
        />
      </Col>
      <Col xs={8} className="ms-1 flex-grow-1 px-0 px-sm-1">
        <div id='conversation-name'>
          {[member.firstName, member.lastName].filter(e=>e).join(' ')}
        </div>
        <div id='conversation-preview'
          className='text-truncate'
        >
          {'@'+member.username}
        </div>
      </Col>
    </Row>
  })
  
  return (
    <Modal
      onHide={() => {setShowMembers(false); setSearchQuery('')}}
      show={showMembers}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <div className= "d-flex flex-column"
        style={{height: '75vh'}}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Member
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        <form className='d-flex flex-column'
          style={{height: '100%'}}
          onSubmit={(e)=>e.preventDefault()}
        >
          <Form.Group controlId="memberId" onChange={handleChange}>
            <Form.Control type="text" placeholder="Search for username" required/>
          </Form.Group>
          <div className="flex-grow-1" style={{overflowY: 'auto'}}>
            {listSuggestions}
          </div>
          <Button variant="primary" onClick={()=>{setIsAdding(true); setShowMembers(false)}}>
            Add Member
          </Button>
        </form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default MemberList;