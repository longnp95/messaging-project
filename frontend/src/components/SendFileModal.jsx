import axios from "axios";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const SendFileModal = ({user, filesArray, setFilesArray, sendingFile, setSendingFile}) => {
  const [loadMessage, setLoadMessage] = useState('');
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoadMessage("Creating Group...");
  //   let conversationAvatarUrl=form.conversationAvatarUrl;
  //   if (form.conversationAvatar) {
  //     var formData = new FormData();
  //     formData.append("files", form.conversationAvatar);
  //     setLoadMessage('Uploading Images...');
  //     const imgUploadRes = await axios.post('/user/media/uploads', formData,{
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         token: user.token
  //       },
  //     });
  //     if (imgUploadRes.data.error.status == 500) {
  //       setLoadMessage(imgUploadRes.data.error.message);
  //     }
  //     setLoadMessage("Creating Group...");
  //     console.log(imgUploadRes.data);
  //     conversationAvatarUrl = imgUploadRes.data.data.medias[0].path
  //     setForm({...form, ["conversationAvatarUrl"]:conversationAvatarUrl})
  //   }

  //   const response = await axios.post('/conversation/create',{
  //     conversationName: form.conversationName,
  //     conversationAvatarUrl: conversationAvatarUrl,
  //     typeConversation: form.typeConversation
  //   },{
  //     headers: {token: user.token},
  //     params: {userId: user.id},
  //   });
  //   if (response.data.error.status == 500) {
  //     setLoadMessage(response.data.error.message);
  //     return;
  //   }
  //   setCurrentConversation(response.data.data.conversation)
  //   console.log(response.data.data);
  //   setLoadMessage('');
  //   setForm(initialForm);
  //   setIsCreating(false);
  //   setIsAdding(true);
  // }

  // const handleChange = (e) => {
  //   setForm({...form, [e.target.id]:e.target.value})
  // }
  
  return (
    <Modal
      onHide={() => {setFilesArray()}}
      show={filesArray && filesArray.length >0}
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
        {/* {files && files.map((file) => {
          <div>file</div>
        })} */}
        <form /* onSubmit={handleSubmit} */>
          <Form.Group className="mb-3" controlId="conversationName" /* onChange={handleChange} */>
            <Form.Label>Group Name</Form.Label>
            <Form.Control type="text" placeholder="Enter group name" required autoComplete="off"/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="conversationAvatar" /* onChange={(e)=>setForm({...form, conversationAvatar:e.target.files[0]})} */>
            <Form.Label>Avatar</Form.Label>
            <Form.Control type="file" placeholder="Avatar" size="sm" accept="image/*"/>
          </Form.Group>
          <div className="text-info text-truncate">{loadMessage}</div>
          <Button variant="primary" type="submit" disabled={loadMessage ? true : false}>
            Create
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default SendFileModal;