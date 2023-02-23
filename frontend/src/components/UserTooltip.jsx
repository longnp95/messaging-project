import React, {useState} from "react";
import ImageLoader from "../services/ImageLoader.services";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const UserTooltip = ({user, rightBorder}) => {
  return <Row
      id="tooltip-container"
      className={`mx-0 py-1 px-1 flex-nowrap align-items-center userTooltip ${rightBorder?'userTooltip--right':''}`}
    >
      <Col xs="auto" className="g-0 border-right">
        <ImageLoader
          roundedCircle alt="Avatar" 
          src={user.avatar}
          style={{ width: "30px", height: "auto", aspectRatio: "1"}}
        />
      </Col>
      <Col className="me-md-2 ms-1 flex-grow-1 px-0 px-sm-1">
        <div id='conversation-preview' className="text-truncate">
          {[user.firstName, user.lastName].filter(e=>e).join(' ')}
        </div>
        <div id='conversation-preview'
          className='text-truncate'
        >
          {'@'+user.username}
        </div>
      </Col>
    </Row>
}

export default UserTooltip;