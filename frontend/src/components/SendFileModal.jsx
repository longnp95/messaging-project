import axios from "axios";
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const SendFileModal = ({user, filesArray, setFilesArray, setFiles, setMessage, message, sendingFile, setSendingFile, currentConversation,caption,setCaption}) => {
  const [loadMessage, setLoadMessage] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadMessage("Uploading File...");
    let mediaIds=[];
    if (filesArray && filesArray.length) {
      var formData = new FormData();
      console.log(filesArray);
      filesArray.forEach(file => {
        formData.append("files", file);
      });
      const uploadRes = await axios.post('/user/media/uploads', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          token: user.token
        },
      });
      if (uploadRes.data.error.status == 500) {
        setLoadMessage(uploadRes.data.error.message);
      }
      console.log(uploadRes.data);
      const medias = uploadRes.data.data.medias;
      medias.forEach(media => {
        if (media.id) mediaIds.push(media.id);
      });
    }

    const response = await axios.post('/conversation/sendMessage',{
      message: caption,
      mediaIds: mediaIds
    },{
      headers: {token: user.token},
      params: {userId: user.id, conversationId: currentConversation.id},
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
      return;
    }
    console.log(response.data.data);
    console.log(response.data.data);
    setSendingFile(false);
  }

  const handleChange = (e) => {
    setCaption(e.target.value)
  }
  useEffect(() => {
    console.log(filesArray)
  },[filesArray])
  return (
    <Modal
      onHide={() => {setFilesArray([]); setLoadMessage(''); setSendingFile(false)}}
      show={sendingFile}
      onShow={() => setCaption(message)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Sending File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {filesArray.map((file) => {
          return <div key={file.name + file.lastModified + file.size}>{file.name}</div>
        })}
        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="caption" disabled={loadMessage ? true : false}>
            <Form.Label>Caption</Form.Label>
            <Form.Control type="text" placeholder="Enter caption" autoComplete="off" value={caption} onChange={handleChange}/>
          </Form.Group>
          <div className="text-info text-truncate">{loadMessage}</div>
          <Button variant="primary" type="submit" disabled={loadMessage ? true : false}>
            Upload
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default SendFileModal;