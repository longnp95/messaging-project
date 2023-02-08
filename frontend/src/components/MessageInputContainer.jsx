import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Blank_Avatar from '../public/Blank-Avatar.png'

const MessageInputContainer = ({currentConversation, user})=>{
  const handleSubmit = (e)=>{
    e.preventDefault();
    const input = document.getElementById("message_input-container-fields-input-content");
    if (input.value === '') return;
    input.value = 'send ' + input.value + ' to server'
  }

  return (
    <Card.Footer id="message_input-container" className="text-muted d-flex justify-content-start align-items-center p-1">
      <Image
        roundedCircle
        src={user.avatar||Blank_Avatar}
        alt="avatar"
        style={{ width: "45px", height: "45px" }}
      />
      <form onSubmit={handleSubmit} className="text-muted d-flex justify-content-start align-items-center flex-grow-1 ms-2">
        <input
          type="text"
          className="form-control form-control-lg"
          id="message_input-container-fields-input-content"
          placeholder="Type message"
        ></input>
        <i className="mx-1 text-muted material-icons">attach_file</i>
        <i className="mx-1 text-muted material-icons">sentiment_satisfied</i>
        <i className="mx-1 material-icons" onClick={handleSubmit}>send</i>
      </form>
    </Card.Footer>
  )
}

export default MessageInputContainer;