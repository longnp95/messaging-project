import axios from "axios";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const NewConversationForm = ({user, isCreating, setIsCreating, setCurrentConversation, setIsAdding}) => {
  const initialForm = {
    conversationName: "",
    conversationAvatarUrl: "",
    conversationAvatar: null,
    typeConversation: 2
  }
  
  const [form,setForm] = useState(initialForm)

  const handleSubmit = async (e) => {
    e.preventDefault();
    let conversationAvatarUrl=form.conversationAvatarUrl;
    if (form.conversationAvatar) {
      var formData = new FormData();
      formData.append("images", form.conversationAvatar);
      const imgUploadRes = await axios.post('/user/media/images/uploads', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          token: user.token
        },
      });
      if (imgUploadRes.data.error.status == 500) {
        alert(imgUploadRes.data.error.message);
      }
      console.log(imgUploadRes.data);
      conversationAvatarUrl = imgUploadRes.data.data.images[0].path
      setForm({...form, ["conversationAvatarUrl"]:conversationAvatarUrl})
    }

    const response = await axios.post('/conversation/create',{
      conversationName: form.conversationName,
      conversationAvatarUrl: conversationAvatarUrl,
      typeConversation: form.typeConversation
    },{
      headers: {token: user.token},
      params: {userId: user.id},
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
      return;
    }
    setCurrentConversation(response.data.data.conversation)
    console.log(response.data.data);
    setForm(initialForm);
    setIsCreating(false);
    setIsAdding(true);
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.id]:e.target.value})
  }
  
  return (
    <Modal
      onHide={() => setIsCreating(false)}
      show={isCreating}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="conversationName" onChange={handleChange}>
          <Form.Label>Group Name</Form.Label>
          <Form.Control type="text" placeholder="Enter group name" required/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="conversationAvatar" onChange={(e)=>setForm({...form, conversationAvatar:e.target.files[0]})}>
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" placeholder="Avatar" size="sm" accept="image/*"/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </form>
      </Modal.Body>
    </Modal>
  )
}

export default NewConversationForm;