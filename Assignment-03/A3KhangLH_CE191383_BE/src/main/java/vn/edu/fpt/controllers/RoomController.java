package vn.edu.fpt.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.dtos.MessageResponse;
import vn.edu.fpt.dtos.RoomRequest;
import vn.edu.fpt.entity.RoomInformation;
import vn.edu.fpt.services.IRoomService;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private IRoomService roomService;

    // Public: "Do not need authentication to view the room information in this system."
    @GetMapping
    public ResponseEntity<List<RoomInformation>> getActiveRooms(
            @RequestParam(required = false) Integer roomTypeId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(roomService.getActiveRooms(roomTypeId, keyword));
    }

    // Staff: view all rooms (including inactive/deleted)
    @GetMapping("/staff")
    public ResponseEntity<List<RoomInformation>> getAllRooms(
            @RequestParam(required = false) Byte status,
            @RequestParam(required = false) Integer roomTypeId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(roomService.getAllRooms(status, roomTypeId, keyword));
    }

    // Public: view specific room details
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(roomService.getRoomById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    // Staff: Create room
    @PostMapping
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomRequest request) {
        try {
            RoomInformation room = roomService.createRoom(request);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    // Staff: Update room
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Integer id, @Valid @RequestBody RoomRequest request) {
        try {
            RoomInformation room = roomService.updateRoom(id, request);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    // Staff: Delete room
    // Business rule: Delete permanently if no booking transaction; change status to inactive if booked.
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Integer id) {
        try {
            String resultMessage = roomService.deleteRoom(id);
            return ResponseEntity.ok(MessageResponse.ok(resultMessage));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }
}

