package fu.se.a2.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void testResourceNotFoundHandler() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Account not found");
        ResponseEntity<ErrorResponse> response = handler.handleResourceNotFoundException(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Account not found");
        assertThat(response.getBody().getStatus()).isEqualTo(404);
    }

    @Test
    void testConflictExceptionHandler() {
        ConflictException ex = new ConflictException("Cannot delete account because it has created news articles");
        ResponseEntity<ErrorResponse> response = handler.handleConflictException(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).contains("Cannot delete account");
        assertThat(response.getBody().getStatus()).isEqualTo(409);
    }
}
