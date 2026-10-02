import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

function ErrorMessage({ message, onRetry }) {
    return (
        <Alert variant="danger">
            <Alert.Heading>Unable to load orchids</Alert.Heading>

            <p>{message}</p>

            <Button variant="danger" onClick={onRetry}>
                Try Again
            </Button>
        </Alert>
    );
}

export default ErrorMessage;