import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MenuContainer from './MenuContainer';
import ImageLoader from '../services/ImageLoader.services';

function LeftNavBar({setSearchText, user, setCurrentConversation, conversations}) {
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} bg="info" expand={expand} className="" collapseOnSelect>
          <Container fluid className="g-0 flex-nowrap">
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} className="ms-1 p-1">
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
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
            >
              <Offcanvas.Header>
                <div className='d-flex flex-row justify-content-start align-items-center'>
                  <ImageLoader
                    roundedCircle
                    src={user.avatar}
                    alt="avatar"
                    style={{ width: "50px", height: "50px"}}
                  />
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="ms-3">
                    {`${user.firstName} ${user.lastName}`}
                  </Offcanvas.Title>
                </div>
              </Offcanvas.Header>
              <Offcanvas.Body className='px-0'>
                <MenuContainer
                  user={user}
                  setCurrentConversation={setCurrentConversation}
                  conversations={conversations}
                />
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default LeftNavBar;