package vn.edu.fpt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.dtos.BookingCreateRequest;
import vn.edu.fpt.dtos.BookingItemRequest;
import vn.edu.fpt.entity.BookingDetail;
import vn.edu.fpt.entity.BookingReservation;
import vn.edu.fpt.entity.Customer;
import vn.edu.fpt.entity.RoomInformation;
import vn.edu.fpt.repositories.IBookingDetailRepository;
import vn.edu.fpt.repositories.IBookingReservationRepository;
import vn.edu.fpt.repositories.ICustomerRepository;
import vn.edu.fpt.repositories.IRoomInformationRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private IBookingReservationRepository bookingReservationRepository;

    @Autowired
    private IBookingDetailRepository bookingDetailRepository;

    @Autowired
    private ICustomerRepository customerRepository;

    @Autowired
    private IRoomInformationRepository roomInformationRepository;

    @Override
    @Transactional
    public BookingReservation createBooking(String currentUserEmail, BookingCreateRequest request) {
        Customer customer;
        if (request.getCustomerID() != null) {
            customer = customerRepository.findById(request.getCustomerID())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerID()));
        } else {
            customer = customerRepository.findByEmailAddress(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("Current customer not found for email: " + currentUserEmail));
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("A booking must contain at least one room");
        }

        BookingReservation reservation = new BookingReservation();
        reservation.setBookingDate(LocalDate.now());
        reservation.setCustomer(customer);
        reservation.setBookingStatus((byte) 1); // 1: Confirmed

        BigDecimal total = BigDecimal.ZERO;
        List<BookingDetail> details = new ArrayList<>();

        // Pre-save reservation to obtain generated ID if needed
        reservation.setTotalPrice(BigDecimal.ZERO);
        reservation = bookingReservationRepository.save(reservation);

        for (BookingItemRequest item : request.getItems()) {
            RoomInformation room = roomInformationRepository.findById(item.getRoomID())
                    .orElseThrow(() -> new RuntimeException("Room not found with ID: " + item.getRoomID()));

            if (item.getStartDate() == null || item.getEndDate() == null) {
                throw new RuntimeException("Start date and End date are required for room " + room.getRoomNumber());
            }

            if (item.getEndDate().isBefore(item.getStartDate())) {
                throw new RuntimeException("End date cannot be before start date for room " + room.getRoomNumber());
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) {
                days = 1; // Minimum 1 day
            }

            BigDecimal roomPrice = room.getRoomPricePerDay() != null ? room.getRoomPricePerDay() : BigDecimal.ZERO;
            BigDecimal actualPrice = roomPrice.multiply(BigDecimal.valueOf(days));
            total = total.add(actualPrice);

            BookingDetail detail = new BookingDetail(reservation, room, item.getStartDate(), item.getEndDate(), actualPrice);
            details.add(detail);
        }

        reservation.setTotalPrice(total);
        reservation.getBookingDetails().addAll(details);

        return bookingReservationRepository.save(reservation);
    }

    @Override
    public List<BookingReservation> getMyBookingHistory(String customerEmail) {
        Customer customer = customerRepository.findByEmailAddress(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found for email: " + customerEmail));
        return bookingReservationRepository.findByCustomer_CustomerIDOrderByBookingDateDesc(customer.getCustomerID());
    }

    @Override
    public List<BookingReservation> getAllBookings() {
        return bookingReservationRepository.findAllByOrderByBookingDateDesc();
    }

    @Override
    public BookingReservation getBookingById(Integer id) {
        return bookingReservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking reservation not found with ID: " + id));
    }

    @Override
    public BookingReservation updateBookingStatus(Integer id, Byte status) {
        BookingReservation booking = getBookingById(id);
        booking.setBookingStatus(status);
        return bookingReservationRepository.save(booking);
    }
}

