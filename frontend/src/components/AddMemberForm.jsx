import axios from "axios";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const AddMemberForm = ({user, currentConversation, isCreating, setIsCreating, createType, createTypeId}) => {
  const initialForm = {
    memberId: "",
  }
  
  const [form,setForm] = useState(initialForm)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('/conversation/create',{
      memberId: form.memberId
    },{
      headers: {token: user.token},
      params: {userId: user.id},
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
      return;
    }
    console.log(response.data.data);
    setIsCreating(false);
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
        <Form.Group className="mb-3" controlId="memberId" onChange={handleChange}>
          <Form.Label>New member userId</Form.Label>
          <Form.Control type="text" placeholder="Enter new member userId" required/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </form>
      </Modal.Body>
    </Modal>
  )
}

export default AddMemberForm;