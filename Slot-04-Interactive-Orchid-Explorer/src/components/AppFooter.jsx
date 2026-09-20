import { Container } from "react-bootstrap";
import { useUser } from "../context/UserContext";

function AppFooter() {
    const user = useUser();

    return (
        <footer id="about" className="bg-dark text-light py-4 mt-auto">
            <Container className="d-flex flex-column flex-md-row justify-content-between gap-2">
                <span>SBA301 - React Component Architecture</span>

                <span>
                    Logged in as {user.name} ({user.role})
                </span>
            </Container>
        </footer>
    );
}

export default AppFooter;
