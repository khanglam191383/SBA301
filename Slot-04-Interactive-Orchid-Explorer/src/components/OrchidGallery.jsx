import { useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
} from "react-bootstrap";

import OrchidCard from "./OrchidCard";
import OrchidDetailModal from "./OrchidDetailModal";
import orchids from "../data/orchids";

function OrchidGallery() {
    const [selectedOrchid, setSelectedOrchid] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [specialOnly, setSpecialOnly] = useState(false);

    const handleViewDetail = (orchid) => {
        setSelectedOrchid(orchid);
    };

    const handleClose = () => {
        setSelectedOrchid(null);
    };

    const visibleOrchids = orchids.filter((orchid) => {
        const matchesSearch =
            orchid.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            orchid.type
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesSpecial =
            !specialOnly || orchid.special;

        return matchesSearch && matchesSpecial;
    });

    return (
        <Container className="my-5">
            <h2 className="mb-4">Orchid Gallery</h2>

            <div className="d-flex gap-3 mb-4 flex-wrap">
                <Form.Control
                    type="text"
                    placeholder="Search orchids..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    style={{ maxWidth: "400px" }}
                />

                <Button
                    variant={specialOnly ? "warning" : "outline-warning"}
                    onClick={() => setSpecialOnly(!specialOnly)}
                >
                    {specialOnly ? "★ Special Only" : "☆ Show Special Only"}
                </Button>
            </div>

            {visibleOrchids.length === 0 ? (
                <p className="text-muted">
                    No orchids found.
                </p>
            ) : (
                <Row className="g-4">
                    {visibleOrchids.map((orchid) => (
                        <Col
                            key={orchid.id}
                            xs={12}
                            md={6}
                            lg={4}
                        >
                            <OrchidCard
                                orchid={orchid}
                                onViewDetail={handleViewDetail}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <OrchidDetailModal
                orchid={selectedOrchid}
                show={selectedOrchid !== null}
                onClose={handleClose}
            />
        </Container>
    );
}

export default OrchidGallery;