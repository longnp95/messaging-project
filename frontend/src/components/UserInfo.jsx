import axios from "axios";
import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ImageLoader from "../services/ImageLoader.services";
import UserTooltip from "./UserTooltip";

const UserInfo = ({user, userToDisplay, showInfo, setShowInfo, setCurrentUserInfo, conversations, setCurrentConversation}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState([]);

  useEffect(() => {
    setUserInfo(userToDisplay);
    setForm(userToDisplay);
    if (!showInfo) return;
    const queryId = userToDisplay.id;
    axios.get('/user/profile', {
      headers: {token: user.token},
      params: {userId: queryId}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data.user);
      setUserInfo(response.data.data.user);
      setForm(response.data.data.user);
    }).catch((err)=>{
      console.log(err)
    })
  },[user, userToDisplay, showInfo])

  const handleChange = (e) => {
    if (isEditing) setForm({...form, [e.target.id]:e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username} = form;
    let avatarPath = userInfo.avatar;
    if (form.avatar) {
      var formData = new FormData();
      formData.append("images", form.avatar);
      const imgUploadRes = await axios.post('/user/media/images/uploads', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          token: user.token
        },
      });
      if (imgUploadRes.data.error.status == 500) {
        alert(imgUploadRes.data.error.message);
      } else {
        avatarPath = imgUploadRes.data.data.images[0].path;
      }
      console.log(imgUploadRes.data);
    }

    const response = await axios.post('/user/profile/update', {
      ...form,
      avatarPath: avatarPath
    }, {
      headers: {token: user.token},
      params: {userId: user.id},
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
      return;
    }
    console.log(response.data.data);
    if (response.data.data.user) setCurrentUserInfo(response.data.data.user);
    setShowInfo(false);
  }

  const handleDirectMessage = async (suggestion) => {

    const conversation = conversations.find(el => el.typeId==1 && (el.partnerId == suggestion.id || el.creatorId == suggestion.id));
    if (conversation) {
      setCurrentConversation(conversation);
    } else {
      const response = await axios.post('/conversation/create',{
        conversationName: 'DirectMessage',
        conversationAvatarUrl: '',
        typeConversation: 1,
        partnerId: suggestion.id
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
    setShowInfo(false);
  }

  return (
    <Modal
      onHide={() => {setShowInfo(false); setUserInfo([]); setForm([]); setIsEditing(false)}}
      show={showInfo}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className= "d-flex flex-column"
        style={{height: 'auto'}}
      >
        <Modal.Header closeButton>
          <Row
            id="userInfoHeader-container"
            className={`mx-0 py-1 ps-1 flex-nowrap align-items-center`}
          >
            <Col xs="auto" className="g-0 border-right">
              <ImageLoader
                roundedCircle alt="Avatar" 
                src={userToDisplay.avatar}
                style={{ width: "50px", height: "auto", aspectRatio: "1"}}
              />
            </Col>
            <Col className="me-md-2 ms-1 flex-grow-1 px-0 px-sm-1">
              <Modal.Title id="contained-modal-title-vcenter" className="text-truncate">
                {[userToDisplay.firstName, userToDisplay.lastName].join(' ')}
              </Modal.Title>
              <div className="conversation-preview text-truncate">
                {`@${userToDisplay.username}`}
              </div>
            </Col>
          </Row>
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        
        <Form onSubmit={handleSubmit} className='d-flex flex-column'
          style={{maxHeight: '75vh'}}
        >
          {true && (
            <Row className='g-0'>
              <Col className='pe-1'>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder='First Name'
                    onChange={handleChange}
                    value={form.firstName||""}
                    disabled={isEditing ? false : true}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder='Last Name'
                    onChange={handleChange}
                    value={form.lastName||""}
                    disabled={isEditing ? false : true}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          {/* non visible field to ignore Chrome force autofill username and password */}
          <input id="username" type="text" className="d-none"/>
          <input id="password" type="text" className="d-none"/>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder='Username'
              pattern='[A-Za-z0-9_]*'
              onChange={handleChange}
              autoComplete="off"
              value={form.username||""}
              disabled={isEditing ? false : true}
              required
              title='Use character A-Z, a-z, or _'
            />
          </Form.Group>
          <Form.Group controlId="gender">
            <Form.Label >Gender</Form.Label>
            <Form.Select 
              onChange={handleChange} 
              value={form.gender||""}
              disabled={isEditing ? false : true}
            >
              <option disabled>Choose here</option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
              <option value={3}>Non-binary</option>
              <option value={0}>I prefer not to tell</option>
            </Form.Select>
          </Form.Group>
          {isEditing && 
          <Form.Group controlId="avatar">
            <Form.Label>Profile picture</Form.Label>
            <Form.Control
              type="file" placeholder="Avatar" size="sm" accept="image/*"
              onChange={(e)=>setForm({...form, avatar:e.target.files[0]})}
            />
          </Form.Group>
          }
          
          <Row className='g-0'>
            <Col className='pe-1'>
              <Form.Group controlId='dob'>
                <Form.Label>Date Of Birth</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChange}
                  value={form.dob||""}
                  disabled={isEditing ? false : true}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='mobile'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  onChange={handleChange}
                  value={form.mobile||""}
                  disabled={isEditing ? false : true}
                />
              </Form.Group>
            </Col>  
          </Row>
          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder='Email Address'
              onChange={handleChange}
              value={form.email||""}
              disabled={isEditing ? false : true}
            />
          </Form.Group>
          <Form.Group controlId='address'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="address"
              placeholder='Address'
              onChange={handleChange}
              value={form.address||""}
              disabled={isEditing ? false : true}
            />
          </Form.Group>
          {(userToDisplay.id!=user.id) && <div className="d-flex flex-row justify-content-end">
              <Button variant="info" className='mt-2 me-0' onClick={()=> handleDirectMessage(userToDisplay)}>DirectMessage</Button>
            </div>
          }
          {(userToDisplay.id==user.id && !isEditing) && <div className="d-flex flex-row justify-content-start">
                <Button variant="info" className='mt-2 me-0' onClick={()=> setIsEditing(true)}>Edit Profile</Button>
            </div> 
          }
          {userToDisplay.id==user.id && isEditing && 
          <div className="d-flex flex-row justify-content-end">
            <div>
                <Button variant="primary" type="submit" className='mt-2 me-0'>Submit</Button>
            </div>
            <div>
              <Button variant="warning" className='mt-2 me-0 ms-1' onClick={()=> {setIsEditing(false); setForm(userInfo)}}>Cancel</Button>
            </div>
          </div>
            
          }           
        </Form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default UserInfo;