import React, { useState } from 'react';

const MessageInputContainer = ()=>{
  const handleSubmit = (e)=>{
    e.preventDefault();
    const input = document.getElementById("message_input-container-fields-input-content");
    if (input.value == '') return;
    input.value = 'send ' + input.value + ' to server'
  }

  return (
    <div id="message_input-container">
      <div id="message_input-container-fields">
        <form onSubmit={handleSubmit} className="chat-box-tray">
          <input 
            id="message_input-container-fields-input-content"
            type='text'
            placeholder="Write a message..."
            className='input'
          />
          <i className="material-icons" onClick={handleSubmit}>send</i>
        </form>
      </div>
    </div>
  )
}

export default MessageInputContainer;