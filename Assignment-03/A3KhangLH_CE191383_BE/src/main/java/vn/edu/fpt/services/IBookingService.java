package vn.edu.fpt.services;

import vn.edu.fpt.dtos.BookingCreateRequest;
import vn.edu.fpt.entity.BookingReservation;

import java.util.List;

public interface IBookingService {
    BookingReservation createBooking(String currentUserEmail, BookingCreateRequest request);
    List<BookingReservation> getMyBookingHistory(String customerEmail);
    List<BookingReservation> getAllBookings();
    BookingReservation getBookingById(Integer id);
    BookingReservation updateBookingStatus(Integer id, Byte status);
}

