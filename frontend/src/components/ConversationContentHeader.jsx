import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown'
import ImageLoader from '../services/ImageLoader.services';

const ConversationContentHeader = ({currentConversation}) => {
  const [src,setSrc] = useState(currentConversation.avatar);
  return (
    <Card.Header id="conversation_content-header-wrapper" 
      className="d-flex justify-content-between align-items-center p-3 g-0 bg-info text-white"
      style={{ borderRadius: "0" }}
    >
        <i className="material-icons d-md-none">arrow_back</i>
        <ImageLoader 
          roundedCircle alt="Avatar" 
          src={src} 
          style={{ width: "30px", height: "auto", aspectRatio: "1" }}
          className="d-none d-md-block"
          setSrc={setSrc}
        />
        <p className="mb-0 fw-bold">{currentConversation.name}</p>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" variant="info" className='p-0'>
            <i className="material-icons">more_vert</i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Add Member</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </Card.Header>
  )
}

export default ConversationContentHeader