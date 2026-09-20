import { Container, Nav, Navbar } from "react-bootstrap";
import { useUser } from "../context/UserContext";

function AppNavbar() {
    const user = useUser();

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="md" sticky="top">
            <Container>
                <Navbar.Brand href="#top">
                    Orchid Explorer
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-nav" />

                <Navbar.Collapse id="main-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#top">Home</Nav.Link>
                        <Nav.Link href="#gallery">Gallery</Nav.Link>
                        <Nav.Link href="#care">Care Tips</Nav.Link>
                        <Nav.Link href="#about">About</Nav.Link>

                        <Navbar.Text className="ms-3">
                            User: {user.name}
                        </Navbar.Text>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
