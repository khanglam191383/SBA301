package vn.edu.fpt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.entity.RoomInformation;

import java.util.List;

@Repository
public interface IRoomInformationRepository extends JpaRepository<RoomInformation, Integer> {
    List<RoomInformation> findByRoomStatus(Byte roomStatus);

    @Query("SELECT r FROM RoomInformation r WHERE " +
           "(:roomStatus IS NULL OR r.roomStatus = :roomStatus) AND " +
           "(:roomTypeId IS NULL OR r.roomType.roomTypeID = :roomTypeId) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.roomDetailDescription) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<RoomInformation> searchRooms(@Param("roomStatus") Byte roomStatus,
                                      @Param("roomTypeId") Integer roomTypeId,
                                      @Param("keyword") String keyword);
}

