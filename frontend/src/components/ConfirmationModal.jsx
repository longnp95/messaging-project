import React, { useState, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmationModal = ({message, show, setShow, confirmAction, cancelAction}) => {

  return (
    <Modal
      onHide={() => {setShow(false)}}
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className= "d-flex flex-column"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {message}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex-grow-1">
        <form onSubmit={(e)=>e.preventDefault()} className='d-flex flex-column'
          style={{height: '100%'}}
        >
          <Row>
            <Col>
              <Button variant="info" onClick={()=>{setShow(false); confirmAction()}}>
                Confirm
              </Button>
            </Col>
            <Col>
              <Button variant="info" onClick={()=>{setShow(false); confirmAction()}}>
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