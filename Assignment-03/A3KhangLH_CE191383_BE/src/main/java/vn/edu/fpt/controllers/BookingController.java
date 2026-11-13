package vn.edu.fpt.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.dtos.BookingCreateRequest;
import vn.edu.fpt.dtos.BookingStatusUpdateRequest;
import vn.edu.fpt.dtos.MessageResponse;
import vn.edu.fpt.entity.BookingReservation;
import vn.edu.fpt.services.IBookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    // Customer or Staff: Create booking with one or many rooms
    @PostMapping
    public ResponseEntity<?> createBooking(Authentication authentication,
                                          @Valid @RequestBody BookingCreateRequest request) {
        try {
            String currentUserEmail = authentication != null ? authentication.getName() : null;
            BookingReservation booking = bookingService.createBooking(currentUserEmail, request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    // Customer: View booking reservation history
    @GetMapping("/my-history")
    public ResponseEntity<?> getMyHistory(Authentication authentication) {
        try {
            String customerEmail = authentication.getName();
            List<BookingReservation> history = bookingService.getMyBookingHistory(customerEmail);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    // Staff: View all bookings
    @GetMapping
    public ResponseEntity<List<BookingReservation>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Authenticated: Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(bookingService.getBookingById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    // Staff: Update booking status (e.g. 1: Confirmed, 2: Completed, 0: Cancelled)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Integer id,
                                                @Valid @RequestBody BookingStatusUpdateRequest request) {
        try {
            BookingReservation updated = bookingService.updateBookingStatus(id, request.getBookingStatus());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }
}

