import axios from "axios";
import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ImageLoader from "../services/ImageLoader.services";

const DirectMessage = ({user, setCurrentConversation, conversations, isDMing, setIsDMing}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState()

  useEffect(() => {
    setSuggestions([]);
    axios.get('/user/search', {
      headers: {token: user.token},
      params: {search: searchQuery}})
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
  },[searchQuery,user,isDMing])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const conversation = conversations.find(el => el.partnerId == selected.id || el.creatorId == selected.id);
    if (conversation) {
      setCurrentConversation(conversation);
    } else {
      const response = await axios.post('/conversation/create',{
        conversationName: 'DirectMessage',
        conversationAvatarUrl: '',
        typeConversation: 1,
        partnerId: selected.id
      },{
        headers: {token: user.token},
        params: {userId: user.id},
      });
      if (response.data.error.status == 500) {
        alert(response.data.error.message);
        return;
      }
      setCurrentConversation(response.data.data.conversation);
    }
    setIsDMing(false);
    setSearchQuery('');
    setSelected();
  }

  const handleClick = (suggestion) => {
    setSelected(suggestion);
  }

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const listSuggestions = suggestions.map(suggestion => {
    if (suggestion.id == user.id) return <div key={suggestion.id} className="d-none"></div>;
    return <Row
      key={suggestion.id}
      id="suggestion-item-container"
      className={`mx-0 py-1 ps-1 flex-nowrap ${selected && suggestion.id == selected.id ? 'bg-info' : ''}`}
      onClick={() => {
        handleClick(suggestion)
      }}
    >
      <Col xs="auto" className="g-0 border-right">
        <ImageLoader
          roundedCircle alt="Avatar" 
          src={suggestion.avatar}
          style={{ width: "50px", height: "auto", aspectRatio: "1"}}
        />
      </Col>
      <Col className="me-md-2 ms-1 flex-grow-1 px-0 px-sm-1">
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
      onHide={() => {setIsDMing(false); setSearchQuery(''); setSelected()}}
      show={isDMing}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <div className= "d-flex flex-column"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Direct Messaging
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        <form onSubmit={handleSubmit} className='d-flex flex-column'
          style={{height: '70vh'}}
        >
          <Form.Group controlId="memberId" onChange={handleChange}>
            <Form.Control type="text" placeholder="Search for username" autoComplete="off"/>
          </Form.Group>
          <div className="flex-grow-1" style={{overflowY: 'auto'}}>
            {listSuggestions}
          </div>
          {selected
          ? (<div>
            <div>Selected</div>
            <Row
              id="selected-item-container"
              className="mx-0 py-1 ps-1 flex-nowrap bg-info"
            >
              <Col className="g-0 border-right">
                <ImageLoader
                  roundedCircle alt="Avatar" 
                  src={selected.avatar}
                  style={{ width: "50px", height: "auto", aspectRatio: "1"}}
                />
              </Col>
              <Col xs={8} className="ms-1 flex-grow-1 px-0 px-sm-1">
                <div id='conversation-name'>
                  {[selected.firstName, selected.lastName].filter(e=>e).join(' ')}
                </div>
                <div id='conversation-preview'
                  className='text-truncate'
                >
                  {'@'+selected.username}
                </div>
              </Col>
            </Row>
          </div>)
          : <div>Select an user</div>
          }
          <Button variant="primary" type="submit" disabled={!selected}>
            Message
          </Button>
        </form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default DirectMessage;