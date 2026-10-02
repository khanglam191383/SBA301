import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

function OrchidDetailModal({ show, orchid, onClose }) {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {orchid?.name || "Orchid Detail"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {orchid && (
                    <>
                        <img
                            src={orchid.image}
                            alt={orchid.name}
                            className="img-fluid rounded mb-3"
                        />

                        <p>
                            <strong>Category:</strong> {orchid.category}
                        </p>

                        <p>
                            <strong>Origin:</strong> {orchid.origin}
                        </p>

                        <p>
                            <strong>Color:</strong> {orchid.color}
                        </p>

                        <p>
                            <strong>Rating:</strong> {orchid.rating}
                        </p>

                        <p>
                            <strong>Special:</strong>{" "}
                            {orchid.isSpecial ? (
                                <Badge bg="warning" text="dark">
                                    Special
                                </Badge>
                            ) : (
                                "No"
                            )}
                        </p>

                        <p>
                            <strong>Description:</strong> {orchid.description}
                        </p>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OrchidDetailModal;