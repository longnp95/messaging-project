import axios from "axios";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const NewConversationForm = ({user, isCreating, setIsCreating, setCurrentConversation, setIsAdding}) => {
  const initialForm = {
    conversationName: "",
    conversationAvatarUrl: "",
    typeConversation: 2
  }
  
  const [form,setForm] = useState(initialForm)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('/conversation/create',{
      conversationName: form.conversationName,
      conversationAvatarUrl: form.conversationAvatarUrl,
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
        <Form.Group className="mb-3" controlId="conversationAvatarUrl" onChange={handleChange}>
          <Form.Label>Avatar Url</Form.Label>
          <Form.Control type="text" placeholder="Avatar Url" />
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