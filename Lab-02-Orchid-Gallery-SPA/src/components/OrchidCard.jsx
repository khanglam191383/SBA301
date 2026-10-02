import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

function OrchidCard({ orchid, onDetail }) {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Img
                variant="top"
                src={orchid.image}
                alt={orchid.name}
                style={{ height: "220px", objectFit: "cover" }}
            />

            <Card.Body>
                <Card.Title>{orchid.name}</Card.Title>

                <Card.Text>
                    Category: {orchid.category}
                </Card.Text>

                {orchid.isSpecial && (
                    <Badge bg="warning" text="dark" className="mb-3">
                        Special
                    </Badge>
                )}

                <div>
                    <Button
                        variant="primary"
                        onClick={() => onDetail(orchid)}
                    >
                        Detail
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default OrchidCard;