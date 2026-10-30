package fu.se.a2.services;

import fu.se.a2.dtos.TagDto;
import fu.se.a2.entities.Tag;
import fu.se.a2.repositories.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Transactional(readOnly = true)
    public List<TagDto> getAllTags() {
        return tagRepository.findAll().stream()
                .map(t -> new TagDto(t.getTagID(), t.getTagName(), t.getNote()))
                .toList();
    }

    public Set<Tag> resolveTags(List<String> tagNames, List<Integer> tagIds) {
        Set<Tag> resolved = new HashSet<>();

        if (tagIds != null && !tagIds.isEmpty()) {
            resolved.addAll(tagRepository.findAllById(tagIds));
        }

        if (tagNames != null) {
            for (String rawName : tagNames) {
                if (rawName == null || rawName.trim().isEmpty()) continue;
                String name = rawName.trim();
                Tag tag = tagRepository.findByTagName(name)
                        .orElseGet(() -> tagRepository.save(new Tag(null, name, "Auto-created tag")));
                resolved.add(tag);
            }
        }

        return resolved;
    }
}
