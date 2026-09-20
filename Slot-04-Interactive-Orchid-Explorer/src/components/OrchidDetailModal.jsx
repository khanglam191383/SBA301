import { Modal, Button } from "react-bootstrap";

function OrchidDetailModal({ orchid, show, onClose }) {
    if (!orchid) {
        return null;
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{orchid.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <img
                    src={orchid.image}
                    alt={orchid.name}
                    className="img-fluid mb-3"
                />

                <p>
                    <strong>Type:</strong> {orchid.type}
                </p>

                <p>
                    <strong>Description:</strong> {orchid.description}
                </p>

                <p>
                    <strong>Special:</strong>{" "}
                    {orchid.special ? "Yes" : "No"}
                </p>
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