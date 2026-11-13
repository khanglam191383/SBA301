package vn.edu.fpt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.fpt.entity.RoomType;
import vn.edu.fpt.repositories.IRoomTypeRepository;

import java.util.List;

@Service
public class RoomTypeService implements IRoomTypeService {

    @Autowired
    private IRoomTypeRepository roomTypeRepository;

    @Override
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }
}

