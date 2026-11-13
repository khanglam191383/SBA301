package vn.edu.fpt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.entity.BookingDetail;
import vn.edu.fpt.entity.BookingDetailId;

import java.util.List;

@Repository
public interface IBookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {
    boolean existsByRoomInformation_RoomID(Integer roomID);
    List<BookingDetail> findByBookingReservation_BookingReservationID(Integer bookingReservationID);
}

