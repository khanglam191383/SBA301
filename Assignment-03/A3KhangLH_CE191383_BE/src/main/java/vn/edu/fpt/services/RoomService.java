package vn.edu.fpt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.fpt.dtos.RoomRequest;
import vn.edu.fpt.entity.RoomInformation;
import vn.edu.fpt.entity.RoomType;
import vn.edu.fpt.repositories.IBookingDetailRepository;
import vn.edu.fpt.repositories.IRoomInformationRepository;
import vn.edu.fpt.repositories.IRoomTypeRepository;

import java.util.List;

@Service
public class RoomService implements IRoomService {

    @Autowired
    private IRoomInformationRepository roomInformationRepository;

    @Autowired
    private IRoomTypeRepository roomTypeRepository;

    @Autowired
    private IBookingDetailRepository bookingDetailRepository;

    @Override
    public List<RoomInformation> getActiveRooms(Integer roomTypeId, String keyword) {
        return roomInformationRepository.searchRooms((byte) 1, roomTypeId, keyword);
    }

    @Override
    public List<RoomInformation> getAllRooms(Byte status, Integer roomTypeId, String keyword) {
        return roomInformationRepository.searchRooms(status, roomTypeId, keyword);
    }

    @Override
    public RoomInformation getRoomById(Integer id) {
        return roomInformationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));
    }

    @Override
    public RoomInformation createRoom(RoomRequest request) {
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeID())
                .orElseThrow(() -> new RuntimeException("RoomType not found with ID: " + request.getRoomTypeID()));

        RoomInformation room = new RoomInformation();
        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        room.setRoomStatus(request.getRoomStatus() != null ? request.getRoomStatus() : (byte) 1);
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        return roomInformationRepository.save(room);
    }

    @Override
    public RoomInformation updateRoom(Integer id, RoomRequest request) {
        RoomInformation room = getRoomById(id);

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeID())
                .orElseThrow(() -> new RuntimeException("RoomType not found with ID: " + request.getRoomTypeID()));

        room.setRoomNumber(request.getRoomNumber().trim());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(roomType);
        if (request.getRoomStatus() != null) {
            room.setRoomStatus(request.getRoomStatus());
        }
        room.setRoomPricePerDay(request.getRoomPricePerDay());

        return roomInformationRepository.save(room);
    }

    @Override
    public String deleteRoom(Integer id) {
        RoomInformation room = getRoomById(id);

        // Check if room information is already stored in a booking detail
        boolean hasBookingHistory = bookingDetailRepository.existsByRoomInformation_RoomID(id);

        if (hasBookingHistory) {
            // If already in booking detail, just change status to inactive (2)
            room.setRoomStatus((byte) 2);
            roomInformationRepository.save(room);
            return "Room has existing booking transactions. Status has been changed to Inactive (soft deleted).";
        } else {
            // Not belong to any renting transaction -> hard delete
            roomInformationRepository.delete(room);
            return "Room was permanently deleted.";
        }
    }
}

