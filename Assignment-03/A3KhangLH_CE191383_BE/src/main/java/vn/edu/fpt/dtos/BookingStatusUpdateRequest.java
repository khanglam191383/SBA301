package vn.edu.fpt.dtos;

import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateRequest {
    @NotNull(message = "Booking status is required")
    private Byte bookingStatus;

    public BookingStatusUpdateRequest() {
    }

    public BookingStatusUpdateRequest(Byte bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public Byte getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Byte bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
}

