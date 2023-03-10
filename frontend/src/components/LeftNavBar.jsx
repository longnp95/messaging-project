import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MenuContainer from './MenuContainer';
import NewConversationForm from './NewConversationForm';
import DirectMessage from './DirectMessage';
import ImageLoader from '../services/ImageLoader.services';
import { useState } from 'react';

function LeftNavBar({setSearchText, user, setCurrentConversation, conversations, isAdding, setIsAdding, setUserToDisplay, setShowInfo, currentUserInfo}) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDMing, setIsDMing] = useState(false);
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} bg="info" expand={expand} className="" collapseOnSelect>
          <Container fluid className="g-0 flex-nowrap">
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} className="ms-1 p-1" onClick={()=>setShowOffcanvas(true)}>
              <i className="material-icons">menu</i>
            </Navbar.Toggle>
            <Form className="d-flex flex-grow-1" onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="mx-1"
                aria-label="Search"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Form>
            <Offcanvas show={showOffcanvas} onHide={()=>setShowOffcanvas(false)} style={{ maxWidth: "75vw"}}>
              <Offcanvas.Header>
                <div 
                  className='d-flex flex-row justify-content-start align-items-center'
                  onClick={()=>{
                    setUserToDisplay(currentUserInfo);
                    setShowInfo(true);
                    setShowOffcanvas(false);
                  }}
                >
                  <ImageLoader
                    roundedCircle
                    src={currentUserInfo.avatar}
                    alt="avatar"
                    style={{ width: "50px", height: "50px"}}
                  />
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="ms-3">
                    {`${currentUserInfo.firstName} ${currentUserInfo.lastName}`}
                  </Offcanvas.Title>
                </div>
              </Offcanvas.Header>
              <Offcanvas.Body className='px-0'>
                <MenuContainer
                  setIsDMing={setIsDMing}
                  setIsCreating={setIsCreating}
                  setShowOffcanvas={setShowOffcanvas}
                  user={user}
                  setCurrentConversation={setCurrentConversation}
                  conversations={conversations}
                  setShowInfo={setShowInfo}
                  setUserToDisplay={setUserToDisplay}
                  currentUserInfo={currentUserInfo}
                />
              </Offcanvas.Body>
            </Offcanvas>
            
            <NewConversationForm 
              setCurrentConversation={setCurrentConversation}
              onHide={() => setIsCreating(false)}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              user={user}
              isAdding={isAdding}
              setIsAdding={setIsAdding}
            />

            <DirectMessage 
              onHide={() => setIsDMing(false)}
              isDMing={isDMing}
              setIsDMing={setIsDMing}
              user={user}
              setCurrentConversation={setCurrentConversation}
              conversations={conversations}
            />
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default LeftNavBar;