import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MenuContainer from './MenuContainer';

function LeftNavBar({setSearchText, user}) {
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} bg="info" expand={expand} className="mb-3">
          <Container fluid className="g-0">
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Form className="d-flex flex-grow-1">
              <Form.Control
                type="search"
                placeholder="Search"
                className="mx-2"
                aria-label="Search"
              />
            </Form>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
            >
              <Offcanvas.Header>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Username
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className='px-0'>
                <MenuContainer
                  user={user}
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