import { useState } from "react";
import { Card, Button } from "react-bootstrap";

function OrchidCard({ orchid, onViewDetail }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <Card className="h-100 orchid-card shadow-sm">
            <Card.Img
                variant="top"
                src={orchid.image}
                alt={orchid.name}
            />

            <Card.Body>
                <Card.Title>{orchid.name}</Card.Title>

                <Card.Text>
                    <strong>{orchid.type}</strong>
                    <br />
                    {orchid.description}
                </Card.Text>

                <div className="d-flex gap-2">
                    <Button
                        variant="primary"
                        onClick={() => onViewDetail(orchid)}
                    >
                        View Detail
                    </Button>

                    <Button
                        variant={isFavorite ? "danger" : "outline-danger"}
                        onClick={handleFavorite}
                    >
                        {isFavorite ? "♥ Favorited" : "♡ Favorite"}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default OrchidCard;