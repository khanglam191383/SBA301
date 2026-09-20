import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { OrchidsData } from "../data/orchids";
import OrchidCard from "./OrchidCard";

function OrchidList() {
    return (
        <Container className="py-5" id="orchids">
            <h2 className="mb-4">Orchid Collection</h2>

            <Row className="g-4">
                {OrchidsData.map((orchid) => (
                    <Col key={orchid.id} xs={12} sm={6} lg={4}>
                        <OrchidCard orchid={orchid} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default OrchidList;