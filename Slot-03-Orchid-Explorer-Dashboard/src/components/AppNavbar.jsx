import { Container, Nav, Navbar } from 'react-bootstrap';

function AppNavbar() {
    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="md" sticky="top">
            <Container>
                <Navbar.Brand href="#top">Orchid Explorer</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="ms-auto">
                        SBA301 - Slot 03 | Thuc hanh React Component Architecture & React-Bootstrap
                        Trang 10
                        <Nav.Link href="#top">Home</Nav.Link>
                        <Nav.Link href="#gallery">Gallery</Nav.Link>
                        <Nav.Link href="#care">Care Tips</Nav.Link>
                        <Nav.Link href="#about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;