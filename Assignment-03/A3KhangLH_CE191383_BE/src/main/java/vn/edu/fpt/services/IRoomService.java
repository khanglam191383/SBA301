package vn.edu.fpt.services;

import vn.edu.fpt.dtos.RoomRequest;
import vn.edu.fpt.entity.RoomInformation;

import java.util.List;

public interface IRoomService {
    List<RoomInformation> getActiveRooms(Integer roomTypeId, String keyword);
    List<RoomInformation> getAllRooms(Byte status, Integer roomTypeId, String keyword);
    RoomInformation getRoomById(Integer id);
    RoomInformation createRoom(RoomRequest request);
    RoomInformation updateRoom(Integer id, RoomRequest request);
    String deleteRoom(Integer id);
}

