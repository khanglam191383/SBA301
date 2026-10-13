package fu.se.backend.orchids;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/orchids")
public class OrchidController {

    private final IOrchidService service;

    public OrchidController(IOrchidService service) {
        this.service = service;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<Orchid>> fetchAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getById(@PathVariable int id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping({"", "/"})
    public ResponseEntity<Orchid> saveOrchid(@Valid @RequestBody Orchid orchid) {
        Orchid created = service.create(orchid);
        URI location = URI.create("/orchids/" + created.getOrchidId());
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> updateOrchid(
            @PathVariable int id,
            @Valid @RequestBody Orchid orchid
    ) {
        return service.update(id, orchid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable int id) {
        if (!service.delete(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
