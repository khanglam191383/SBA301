package fu.se.a2.services;

import fu.se.a2.dtos.NewsArticleDto;
import fu.se.a2.dtos.NewsArticleRequest;
import fu.se.a2.dtos.TagDto;
import fu.se.a2.entities.Category;
import fu.se.a2.entities.NewsArticle;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.entities.Tag;
import fu.se.a2.exceptions.ResourceNotFoundException;
import fu.se.a2.repositories.CategoryRepository;
import fu.se.a2.repositories.NewsArticleRepository;
import fu.se.a2.repositories.SystemAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagService tagService;

    public NewsArticleService(NewsArticleRepository newsArticleRepository,
                              CategoryRepository categoryRepository,
                              SystemAccountRepository accountRepository,
                              TagService tagService) {
        this.newsArticleRepository = newsArticleRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagService = tagService;
    }

    @Transactional(readOnly = true)
    public List<NewsArticleDto> searchStaffNews(String keyword, Integer categoryId, String status) {
        List<NewsArticle> articles = newsArticleRepository.searchStaffNews(keyword, categoryId, status);
        return articles.stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<NewsArticleDto> searchPublicNews(String keyword, Integer categoryId) {
        List<NewsArticle> articles = newsArticleRepository.searchPublicNews(keyword, categoryId);
        return articles.stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<NewsArticleDto> getMyHistory(Integer currentUserId) {
        List<NewsArticle> articles = newsArticleRepository.findByCreatedBy_AccountIDOrderByCreatedDateDesc(currentUserId);
        return articles.stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public NewsArticleDto getNewsById(Integer id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        return mapToDto(article);
    }

    public NewsArticleDto createNews(NewsArticleRequest req, Integer currentUserId) {
        Category category = categoryRepository.findById(req.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + req.getCategoryID()));

        SystemAccount creator = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + currentUserId));

        NewsArticle article = new NewsArticle();
        article.setNewsTitle(req.getNewsTitle());
        article.setHeadline(req.getHeadline());
        article.setNewsContent(req.getNewsContent());
        article.setNewsSource(req.getNewsSource());
        article.setCategory(category);
        article.setNewsStatus(req.getNewsStatus() != null ? req.getNewsStatus() : "1");
        article.setCreatedBy(creator);
        article.setCreatedDate(LocalDateTime.now());
        article.setModifiedDate(LocalDateTime.now());

        Set<Tag> tags = tagService.resolveTags(req.getTagNames(), req.getTagIds());
        article.setTags(tags);

        NewsArticle saved = newsArticleRepository.save(article);
        return mapToDto(saved);
    }

    public NewsArticleDto updateNews(Integer id, NewsArticleRequest req, Integer currentUserId) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        Category category = categoryRepository.findById(req.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + req.getCategoryID()));

        SystemAccount updater = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + currentUserId));

        article.setNewsTitle(req.getNewsTitle());
        article.setHeadline(req.getHeadline());
        article.setNewsContent(req.getNewsContent());
        article.setNewsSource(req.getNewsSource());
        article.setCategory(category);
        if (req.getNewsStatus() != null) {
            article.setNewsStatus(req.getNewsStatus());
        }
        article.setUpdatedBy(updater);
        article.setModifiedDate(LocalDateTime.now());

        Set<Tag> tags = tagService.resolveTags(req.getTagNames(), req.getTagIds());
        article.setTags(tags);

        NewsArticle updated = newsArticleRepository.save(article);
        return mapToDto(updated);
    }

    public void deleteNews(Integer id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        newsArticleRepository.delete(article);
    }

    private NewsArticleDto mapToDto(NewsArticle article) {
        NewsArticleDto dto = new NewsArticleDto();
        dto.setNewsArticleID(article.getNewsArticleID());
        dto.setNewsTitle(article.getNewsTitle());
        dto.setHeadline(article.getHeadline());
        dto.setCreatedDate(article.getCreatedDate());
        dto.setNewsContent(article.getNewsContent());
        dto.setNewsSource(article.getNewsSource());

        if (article.getCategory() != null) {
            dto.setCategoryID(article.getCategory().getCategoryID());
            dto.setCategoryName(article.getCategory().getCategoryName());
        }

        dto.setNewsStatus(article.getNewsStatus());

        if (article.getCreatedBy() != null) {
            dto.setCreatedByID(article.getCreatedBy().getAccountID());
            dto.setCreatedByName(article.getCreatedBy().getAccountName());
        }

        if (article.getUpdatedBy() != null) {
            dto.setUpdatedByID(article.getUpdatedBy().getAccountID());
            dto.setUpdatedByName(article.getUpdatedBy().getAccountName());
        }

        dto.setModifiedDate(article.getModifiedDate());

        if (article.getTags() != null) {
            dto.setTags(article.getTags().stream()
                    .map(t -> new TagDto(t.getTagID(), t.getTagName(), t.getNote()))
                    .toList());
        }

        return dto;
    }
}
