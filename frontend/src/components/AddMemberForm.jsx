import axios from "axios";
import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ImageLoader from "../services/ImageLoader.services";

const AddMemberForm = ({user, currentConversation, isAdding, setIsAdding, createType, createTypeId}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const initialForm = {
    memberId: "",
  }
  
  const [form,setForm] = useState(initialForm)

  useEffect(() => {
    setSuggestions([]);
    if (searchQuery.length>0) axios.get('/user', {
      headers: {token: user.token},
      params: {username: searchQuery}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data.users)
      setSuggestions(response.data.data.users);
    }).catch((err)=>{
      console.log(err)
    })
  },[searchQuery,user])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('/conversation/addMember',{
      memberId: form.memberId
    },{
      headers: {token: user.token},
      params: {
        userId: user.id,
        conversationId: currentConversation.id
      },
    });
    console.log(response.data.data);
    setIsAdding(false);
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
    }
    setSearchQuery('')
  }

  const handleClick = (suggestion) => {
    setForm({...form, memberId: suggestion.id})
  }

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const listSuggestions = suggestions.map(suggestion => {
    return <Row
      key={suggestion.id}
      id="suggestion-item-container"
      className="mx-0 py-1 ps-1 flex-nowrap"
      onClick={() => handleClick(suggestion)}
    >
      <Col className="g-0 border-right">
        <ImageLoader
          roundedCircle alt="Avatar" 
          src={suggestion.avatar}
          style={{ width: "50px", height: "auto", aspectRatio: "1"}}
        />
      </Col>
      <Col xs={8} className="ms-1 flex-grow-1 px-0 px-sm-1">
        <div id='conversation-name'>
          {[suggestion.firstName, suggestion.lastName].filter(e=>e).join(' ')}
        </div>
        <div id='conversation-preview'
          className='text-truncate'
        >
          {'@'+suggestion.username}
        </div>
      </Col>
    </Row>
  })
  
  return (
    <Modal
      onHide={() => {setIsAdding(false); setSearchQuery('')}}
      show={isAdding}
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
        <form onSubmit={handleSubmit} className='d-flex flex-column'
          style={{height: '100%'}}
        >
          <Form.Group controlId="memberId" onChange={handleChange}>
            <Form.Control type="text" placeholder="Search for username" required/>
          </Form.Group>
          <div className="flex-grow-1" style={{overflowY: 'auto'}}>
            {listSuggestions}
          </div>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default AddMemberForm;