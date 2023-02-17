import axios from "axios";
import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ImageLoader from "../services/ImageLoader.services";

const AddMemberForm = ({user, currentConversation, isAdding, setIsAdding, members, setMembers}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selecteds, setSelecteds] = useState([]);

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
    setIsAdding(false);
    if (!selecteds.length) return
    for (const selected of selecteds) {
      const response = await axios.post('/conversation/addMember',{
        memberId: selected.id
      },{
        headers: {token: user.token},
        params: {
          userId: user.id,
          conversationId: currentConversation.id
        },
      });
      console.log(response.data.data);
    }
    
    
    setSearchQuery('');
    setSelecteds([]);
  }

  const isSelected = (suggestion) => {
    return selecteds.findIndex(el => el.id == suggestion.id) != -1;
  }

  const isGroupMember = (suggestion) => {
    return members.findIndex(el => el.id == suggestion.id) != -1;
  }

  const handleClick = (suggestion) => {
    if (isSelected(suggestion)) return;
    setSelecteds(prevSelecteds => [...prevSelecteds, suggestion]);
  }

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRemove = (selected) => {
    setSelecteds(prevSelecteds => prevSelecteds.filter(el => el.id != selected.id));
  }

  const listSuggestions = suggestions.map(suggestion => {
    if (suggestion.id == user.id) return <div key={suggestion.id} className="d-none"></div>;
    return <Row
      key={suggestion.id}
      id="suggestion-item-container"
      className={`mx-0 py-1 ps-1 flex-nowrap ${isSelected(suggestion)||isGroupMember(suggestion) ? 'd-none' : ''}`}
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
      onHide={() => {setIsAdding(false); setSearchQuery(''); setSelecteds([]); setMembers([])}}
      show={isAdding}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <div className= "d-flex flex-column"
        style={{height: 'auto'}}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Member
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        <form onSubmit={handleSubmit} className='d-flex flex-column'
          style={{height: '75vh'}}
        >
          <Form.Group controlId="memberId" onChange={handleChange}>
            <Form.Control type="text" placeholder="Search for username" autocomplete="off"/>
          </Form.Group>
          <div className="flex-grow-1" style={{overflowY: 'auto'}}>
            {listSuggestions}
          </div>
          {selecteds.length
          ? (<div>
            <div>Selected</div>
            <div className="d-flex flex-row flex-wrap py-2">
              {selecteds.map((selected) => <div 
                  key={selected.id}
                  className="bg-info p-1 d-flex flex-row flex-nowrap me-1 my-1 align-items-center text-white"
                  style={{borderRadius: "2rem"}}
                >
                  <ImageLoader
                    roundedCircle alt="Avatar" 
                    src={selected.avatar}
                    style={{ width: "20px", height: "auto", aspectRatio: "1"}}
                    className="me-2"
                  />
                  <div style={{fontSize: "15px", verticalAlign: "middle"}}>{[selected.firstName, selected.lastName].filter(e=>e).join(' ')}</div>
                  <div className="material-icons font-weight-light ms-2 my-0"
                    style={{fontSize: "15px", verticalAlign: "middle"}}
                    onClick={() => handleRemove(selected)}
                  >close</div>
                </div>
              )}
            </div>
          </div>)
          : <div>Select an user</div>
          }
          <Button variant="primary" type="submit" disabled={!selecteds.length}>
            Add
          </Button>
        </form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default AddMemberForm;