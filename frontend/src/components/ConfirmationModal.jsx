import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmationModal = ({message, show, setShow, confirmAction, cancelAction}) => {
  console.log('ConfirmationModal');
  return (
    <Modal
      onHide={() => {setShow(false); cancelAction()}}
      show={show}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className= "d-flex flex-column"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {message}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        <form onSubmit={(e)=>e.preventDefault()} className='d-flex flex-column'
          style={{height: '100%'}}
        >
          <Row className="justify-content-center">
            <Col className='d-flex flex-column'>
              <Button variant="info" onClick={()=>{setShow(false); confirmAction()}}>
                Confirm
              </Button>
            </Col>
            <Col className='d-flex flex-column'>
              <Button variant="info" onClick={()=>{setShow(false); cancelAction()}}>
                Cancel
              </Button>            
            </Col>
          </Row>
        </form>
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default ConfirmationModal;