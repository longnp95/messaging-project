import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ImageLoader from '../services/ImageLoader.services';
import SendFileModal from './SendFileModal';
import * as unicodeEmoji from 'unicode-emoji';
import Dropdown from 'react-bootstrap/Dropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';

const MessageInputContainer = ({currentConversation, user, currentUserInfo})=>{
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState();
  const [filesArray, setFilesArray] = useState();
  const [sendingFile, setSendingFile] = useState(false);
  const emojiByCategories = unicodeEmoji.getEmojisGroupedBy('category');
  const categories = [
    {
      category: 'face-emotion',
      icon: '😀'
    },
    {
      category: 'person-people',
      icon: '🧑'
    },
    {
      category: 'animals-nature',
      icon: '🐕'
    },
    {
      category: 'food-drink',
      icon: '🍉'
    },
    {
      category: 'travel-places',
      icon: '🌍'
    },
    {
      category: 'activities-events',
      icon: '🎄'
    },
    {
      category: 'symbols',
      icon: '♠️'
    },
    {
      category: 'objects',
      icon: '🥼'
    },
    {
      category: 'flags',
      icon: '🏳️‍⚧️'
    },
  ];

  useEffect(() => {
    if (files) {
      setFilesArray(Array.from(files));
      setSendingFile(true);
      setFiles();
    }
    console.log(files);
  },[files])
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
  }
  const handleChange= (e) => {
    setMessage(e.target.value);
  }

  return (
    <Card.Footer id="message_input-container" className="text-muted d-flex justify-content-start align-items-center p-1">
      <ImageLoader
        roundedCircle
        src={currentUserInfo.avatar}
        alt="avatar"
        style={{ width: "45px", height: "45px" }}
      />
      <form onSubmit={(e)=>handleSubmit(e)} className="text-muted d-flex justify-content-start align-items-center flex-grow-1 ms-2">
        <input
          type="text"
          className="form-control form-control-lg"
          id="message_input-container-fields-input-content"
          placeholder="Type message"
          value={message}
          onChange={handleChange}
          autoComplete="off"
        ></input>
        <input type="file" id="imgupload" className='d-none' multiple files={files} onChange={(e)=>setFiles(e.target.files)}/>
        <label htmlFor='imgupload' className="p-0 mx-1 material-icons">
          attach_file
        </label>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" className='px-0 material-icons text-dark emoji-selector' style={{backgroundColor: "transparent", border: "none"}}>
            sentiment_satisfied
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ width: "50vh"}}>
            <Tabs defaultActiveKey={categories[0].category} className="" >
              {categories.map((category)=>{
                return <Tab key={category.category} eventKey={category.category} title={category.icon} style={{height: "40vh", overflowY: "auto"}}>
                  {emojiByCategories[category.category]
                    .map((emoji) => 
                    <span 
                      key={emoji.emoji} 
                      className="emoji_icon me-1"
                      style={{fontSize: "25px"}}
                      onClick={()=>setMessage(prevMessage => prevMessage + emoji.emoji)}
                    >
                      {emoji.emoji}
                    </span>)
                  }
                </Tab>
              })}
            </Tabs>
          </Dropdown.Menu>
        </Dropdown>
        
        <button 
          type="submit" 
          className="p-0 my-0 mx-1 material-icons"
          style={{ border: "none", backgroundColor: "transparent"}}
        >send</button>
      </form>
      <SendFileModal
        user={user}
        filesArray={filesArray}
        setFilesArray={setFilesArray}
        sendingFile={sendingFile}
        setSendingFile={setSendingFile}
      />
    </Card.Footer>
  )
}

export default MessageInputContainer;