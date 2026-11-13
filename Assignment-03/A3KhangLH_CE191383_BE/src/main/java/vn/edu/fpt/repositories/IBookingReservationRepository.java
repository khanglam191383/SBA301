package vn.edu.fpt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.entity.BookingReservation;

import java.util.List;

@Repository
public interface IBookingReservationRepository extends JpaRepository<BookingReservation, Integer> {
    List<BookingReservation> findByCustomer_CustomerIDOrderByBookingDateDesc(Integer customerID);
    List<BookingReservation> findAllByOrderByBookingDateDesc();

    @Query("SELECT MAX(b.bookingReservationID) FROM BookingReservation b")
    Integer findMaxId();
}

