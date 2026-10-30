package fu.se.a2.repositories;

import fu.se.a2.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {

    Optional<Tag> findByTagName(String tagName);

    List<Tag> findByTagNameIn(Collection<String> tagNames);

    boolean existsByTagName(String tagName);
}
