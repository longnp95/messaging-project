import axios from "axios";
import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ImageLoader from "../services/ImageLoader.services";
import Dropdown from "react-bootstrap/Dropdown";

const MemberList = ({user, currentConversation, showMembers, setShowMembers, setIsAdding, roles, setConfirmMessage, setConfirmAction, setConfirming, setConversations, setCurrentConversation}) => {
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
      console.log(response.data.data.conversation.users);
      setMembers(response.data.data.conversation.users);
    }).catch((err)=>{
      console.log(err)
    })
  },[currentConversation,user,showMembers])

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }
  console.log(members);
  console.log(roles);
  const deleteConversation = () => {
    axios.post('/conversation/delete',{}, {
      headers: {token: user.token},
      params: {conversationId: currentConversation.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data);
      setCurrentConversation([]);
      setConversations(prevConversations => prevConversations.filter(conversation => conversation.id!=currentConversation.id));
    }).catch((err)=>{
      console.log(err)
    })
  }

  const isLeader = members.find(el=>el.id==user.id && el.group_member.roleId==1)

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
        style={{height: '75vh'}}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {`${currentConversation.name}`}
          </Modal.Title>
          {(currentConversation.typeId!=1)&&isLeader&&
          <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" variant="white" className='p-0'>
                <i className="material-icons">more_vert</i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item 
                  onClick={() => {
                    setConfirmMessage('Are you sure to delete current group?'); 
                    setConfirmAction(()=>deleteConversation); 
                    setConfirming(true);
                    setShowMembers(false);
                  }}
                >
                  Delete Group
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          }
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        <form className='d-flex flex-column'
          style={{height: '100%'}}
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