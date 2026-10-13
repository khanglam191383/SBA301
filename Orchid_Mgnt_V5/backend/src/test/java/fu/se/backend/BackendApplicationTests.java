package fu.se.backend;

import fu.se.backend.orchids.Orchid;
import fu.se.backend.orchids.OrchidRepository;
import fu.se.backend.orchids.OrchidService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

    @Autowired
    private OrchidService orchidService;

    @Autowired
    private OrchidRepository orchidRepository;

    @BeforeEach
    void setUp() {
        orchidRepository.deleteAll();
    }

    @Test
    void contextLoads() {
        assertNotNull(orchidService);
        assertNotNull(orchidRepository);
    }

    @Test
    void testCreateAndFindAll() {
        Orchid o = new Orchid();
        o.setOrchidName("Phalaenopsis Bellina");
        o.setNatural(true);
        o.setOrchidCategory("Phalaenopsis");
        o.setOrchidDescription("Highly fragrant species orchid.");
        o.setAttractive(true);
        o.setOrchidURL("https://example.com/bellina.jpg");

        Orchid saved = orchidService.create(o);
        assertNotNull(saved.getOrchidId());
        assertEquals("Phalaenopsis Bellina", saved.getOrchidName());

        List<Orchid> list = orchidService.findAll();
        assertEquals(1, list.size());
    }

    @Test
    void testFindById() {
        Orchid o = new Orchid();
        o.setOrchidName("Cattleya Walkeriana");
        o.setNatural(true);
        o.setOrchidCategory("Cattleya");
        o.setOrchidDescription("Miniature Cattleya.");
        o.setAttractive(true);
        o.setOrchidURL("https://example.com/walkeriana.jpg");

        Orchid saved = orchidService.create(o);
        Optional<Orchid> found = orchidService.findById(saved.getOrchidId());
        assertTrue(found.isPresent());
        assertEquals("Cattleya Walkeriana", found.get().getOrchidName());
    }

    @Test
    void testUpdateOrchid() {
        Orchid o = new Orchid();
        o.setOrchidName("Vanda Coerulea");
        o.setNatural(true);
        o.setOrchidCategory("Vanda");
        o.setAttractive(false);

        Orchid saved = orchidService.create(o);

        Orchid updateData = new Orchid();
        updateData.setOrchidName("Vanda Coerulea Blue");
        updateData.setNatural(false);
        updateData.setOrchidCategory("Vanda Hybrid");
        updateData.setAttractive(true);
        updateData.setOrchidDescription("Blue orchid hybrid.");
        updateData.setOrchidURL("https://example.com/vanda.jpg");

        Optional<Orchid> updated = orchidService.update(saved.getOrchidId(), updateData);
        assertTrue(updated.isPresent());
        assertEquals("Vanda Coerulea Blue", updated.get().getOrchidName());
        assertEquals("Vanda Hybrid", updated.get().getOrchidCategory());
        assertTrue(updated.get().isAttractive());
        assertFalse(updated.get().isNatural());
    }

    @Test
    void testDeleteOrchid() {
        Orchid o = new Orchid();
        o.setOrchidName("Paphiopedilum Rothchildianum");
        o.setNatural(true);
        o.setOrchidCategory("Paphiopedilum");

        Orchid saved = orchidService.create(o);
        int id = saved.getOrchidId();

        boolean deleted = orchidService.delete(id);
        assertTrue(deleted);
        assertFalse(orchidService.findById(id).isPresent());

        // Deleting again should return false
        assertFalse(orchidService.delete(id));
    }

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Test
    void testJsonSerializationProperties() throws Exception {
        Orchid o = new Orchid();
        o.setOrchidId(1);
        o.setOrchidName("Test Orchid");
        o.setNatural(true);
        o.setAttractive(false);

        String json = objectMapper.writeValueAsString(o);
        assertTrue(json.contains("\"natural\":true"));
        assertTrue(json.contains("\"attractive\":false"));
        assertFalse(json.contains("\"isNatural\""), "JSON should not contain redundant isNatural property");
        assertFalse(json.contains("\"isAttractive\""), "JSON should not contain redundant isAttractive property");
    }
}
