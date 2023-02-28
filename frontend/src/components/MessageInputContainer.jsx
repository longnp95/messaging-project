import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ImageLoader from '../services/ImageLoader.services';
import SendFileModal from './SendFileModal';
import * as unicodeEmoji from 'unicode-emoji';
import Dropdown from 'react-bootstrap/Dropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';

const MessageInputContainer = ({currentConversation, user, currentUserInfo, isEditing, setIsEditing, editingMessage, setEditingMessage, editingMessageText, setEditingMessageText})=>{
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState();
  const [filesArray, setFilesArray] = useState([]);
  const [sendingFile, setSendingFile] = useState(false);
  const emojiByCategories = unicodeEmoji.getEmojisGroupedBy('category');
  const [caption, setCaption] = useState('');
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

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (isEditing) {
      const response = await axios.post('/conversation/editMessage',{
        messageId: editingMessage.id,
        messageContent: editingMessageText
      },{
        headers: {token: user.token},
        params: {userId: user.id, conversationId: currentConversation.id},
      });
      if (response.data.error.status == 500) {
        alert(response.data.error.message);
        return;
      }
      console.log(response.data.data);
      setEditingMessage();
      setEditingMessageText('');
      setIsEditing(false);
      return;
    }
    setMessage('');
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
  }
  const handleChange= (e) => {
    if (isEditing) {
      setEditingMessageText(e.target.value);
    } else {
      setMessage(e.target.value);
    }
  }

  return (
    <Card.Footer 
      id="message_input-container" 
      className="p-1"
      style={{ position: 'relative' }}
    >
      {isEditing && editingMessage &&
        <Row
          id="editing-item-container"
          className={`mx-0 p-1 flex-nowrap align-items-center bg-info`}
          style={{ position: 'absolute', bottom: "100%", left: "0", right: "0"}}
        >
          <Col className="g-0 border-right material-icons text-center">
            edit
          </Col>
          <Col xs={5} sm={9} md={10} className="ms-1 flex-grow-1 flex-shrink-1 px-0 px-sm-1">
            <div id='editing-title'>
                Editing
            </div>
            <div className='d-flex flex-row justify-content-between flex-nowrap align-items-center'>
              {editingMessage.message && editingMessage.message.length &&
                <div id='conversation-preview'
                  className='text-truncate flex-shrink-1'
                >
                  {editingMessage.message}
                </div>
              }
              
              {editingMessage.media && editingMessage.media.length>0 &&
                <div id='file-preview' className='flex-shrink-1 text-truncate text-muted'>
                  {editingMessage.media.map((el)=>el.originalName).join(', ')}
                </div>
              }
            </div>
            
          </Col>
          <Col 
            className="g-0 border-right material-icons text-center" 
            onClick={()=>{
              setEditingMessage();
              setEditingMessageText('');
              setIsEditing(false);
            }}
          >
            cancel
          </Col>
        </Row>
      }
      <div className="text-muted d-flex justify-content-start align-items-center">
        <ImageLoader
          roundedCircle
          src={currentUserInfo.avatar}
          alt="avatar"
          style={{ width: "45px", height: "auto", aspectRatio: "1"}}
        />
        <form onSubmit={(e)=>handleSubmit(e)} className="text-muted d-flex justify-content-start align-items-center flex-grow-1 ms-2">
          <input
            type="text"
            className="form-control form-control-lg"
            id="message_input-container-fields-input-content"
            placeholder={isEditing ?((editingMessage.media && editingMessage.media.length) ? "Type new caption" : "Type new message") : "Type message"}
            value={isEditing ? editingMessageText : message}
            onChange={handleChange}
            autoComplete="off"
          ></input>
          <input 
            type="file" 
            id="imgupload" 
            className='d-none' 
            multiple
            onChange={(e)=>{ 
                console.log(e.target.files);
                setFilesArray([...(e.target.files)]);
                setSendingFile(true);
                e.target.value = null;
              }
            }
          />
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
          >{isEditing ? 'check' : 'send'}</button>
        </form>
      </div>
      
      <SendFileModal
        user={user}
        setFiles={setFiles}
        filesArray={filesArray}
        setFilesArray={setFilesArray}
        sendingFile={sendingFile}
        setSendingFile={setSendingFile}
        message={message}
        setMessage={setMessage}
        currentConversation={currentConversation}
        caption={caption}
        setCaption={setCaption}
      />
    </Card.Footer>
  )
}

export default MessageInputContainer;