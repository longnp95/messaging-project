import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ImageLoader from '../services/ImageLoader.services';
import axios from 'axios';

const MessageInputContainer = ({currentConversation, user})=>{
  const [message, setMessage] = useState('');
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (!message.length>0) return;
    const response = await axios.post('/conversation/sendMessage',{
      message: message,
    },{
      headers: {token: user.token},
      params: {userId: user.id, conversationId: currentConversation.id},
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
      return;
    }
    console.log(response.data.data);
    setMessage('');
    e.target[0].value='';
  }
  const handleChange= (e) => {
    setMessage(e.target.value);
  }

  return (
    <Card.Footer id="message_input-container" className="text-muted d-flex justify-content-start align-items-center p-1">
      <ImageLoader
        roundedCircle
        src={user.avatar}
        alt="avatar"
        style={{ width: "45px", height: "45px" }}
      />
      <form onSubmit={(e)=>handleSubmit(e)} className="text-muted d-flex justify-content-start align-items-center flex-grow-1 ms-2">
        <input
          type="text"
          className="form-control form-control-lg"
          id="message_input-container-fields-input-content"
          placeholder="Type message"
          onChange={handleChange}
          autoComplete="off"
        ></input>
        <i className="mx-1 text-muted material-icons">attach_file</i>
        <i className="mx-1 text-muted material-icons">sentiment_satisfied</i>
        <button 
          type="submit" 
          className="p-0 my-0 mx-1 material-icons"
          style={{ border: "none"}}
        >send</button>
      </form>
    </Card.Footer>
  )
}

export default MessageInputContainer;