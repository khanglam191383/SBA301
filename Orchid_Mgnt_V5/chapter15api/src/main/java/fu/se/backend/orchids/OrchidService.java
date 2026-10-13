package fu.se.backend.orchids;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class OrchidService implements IOrchidService {
    private final OrchidRepository repository;

    public OrchidService(OrchidRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Orchid> getAllOrchids() {
        return repository.findAll();
    }

    @Override
    public List<Orchid> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Orchid> getOrchidByID(int orchidID) {
        return repository.findById(orchidID);
    }

    @Override
    public Optional<Orchid> findById(int orchidId) {
        return repository.findById(orchidId);
    }

    @Override
    @Transactional
    public Orchid insertOrchid(Orchid orchid) {
        orchid.setOrchidId(null);
        return repository.save(orchid);
    }

    @Override
    @Transactional
    public Orchid create(Orchid orchid) {
        return insertOrchid(orchid);
    }

    @Override
    @Transactional
    public Orchid updateOrchid(int orchidID, Orchid orchid) {
        Orchid current = repository.findById(orchidID)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found: " + orchidID));
        current.setOrchidName(orchid.getOrchidName());
        current.setNatural(orchid.isNatural());
        current.setOrchidDescription(orchid.getOrchidDescription());
        current.setOrchidCategory(orchid.getOrchidCategory());
        current.setAttractive(orchid.isAttractive());
        current.setOrchidURL(orchid.getOrchidURL());
        return repository.save(current);
    }

    @Override
    @Transactional
    public Optional<Orchid> update(int orchidId, Orchid input) {
        return repository.findById(orchidId).map(current -> {
            current.setOrchidName(input.getOrchidName());
            current.setNatural(input.isNatural());
            current.setOrchidDescription(input.getOrchidDescription());
            current.setOrchidCategory(input.getOrchidCategory());
            current.setAttractive(input.isAttractive());
            current.setOrchidURL(input.getOrchidURL());
            return repository.save(current);
        });
    }

    @Override
    @Transactional
    public void deleteOrchid(int orchidID) {
        repository.deleteById(orchidID);
    }

    @Override
    @Transactional
    public boolean delete(int orchidId) {
        if (!repository.existsById(orchidId)) {
            return false;
        }
        repository.deleteById(orchidId);
        return true;
    }
}
