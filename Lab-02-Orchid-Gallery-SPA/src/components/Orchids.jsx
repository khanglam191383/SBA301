import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import OrchidCard from "./OrchidCard";
import OrchidDetailModal from "./OrchidDetailModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

import useOrchids from "../hooks/useOrchids";

function Orchids() {
    const [show, setShow] = useState(false);
    const [selectedOrchid, setSelectedOrchid] = useState(null);

    const {
        orchids,
        loading,
        error,
        reload,
    } = useOrchids();

    const handleShow = (orchid) => {
        setSelectedOrchid(orchid);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedOrchid(null);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <Container className="py-4">
                <ErrorMessage
                    message={error}
                    onRetry={reload}
                />
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">Orchid Gallery</h2>

            {orchids.length === 0 ? (
                <p>No orchids found.</p>
            ) : (
                <Row className="g-4">
                    {orchids.map((orchid) => (
                        <Col
                            key={orchid.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <OrchidCard
                                orchid={orchid}
                                onDetail={handleShow}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <OrchidDetailModal
                show={show}
                orchid={selectedOrchid}
                onClose={handleClose}
            />
        </Container>
    );
}

export default Orchids;