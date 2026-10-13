package fu.se.backend.orchids;

import java.util.List;
import java.util.Optional;

public interface IOrchidService {
    List<Orchid> getAllOrchids();
    List<Orchid> findAll();
    Optional<Orchid> getOrchidByID(int orchidID);
    Optional<Orchid> findById(int orchidId);
    Orchid insertOrchid(Orchid orchid);
    Orchid create(Orchid orchid);
    Orchid updateOrchid(int orchidID, Orchid orchid);
    Optional<Orchid> update(int orchidId, Orchid input);
    void deleteOrchid(int orchidID);
    boolean delete(int orchidId);
}
