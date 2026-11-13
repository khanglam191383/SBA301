package vn.edu.fpt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.entity.RoomType;

@Repository
public interface IRoomTypeRepository extends JpaRepository<RoomType, Integer> {
}

