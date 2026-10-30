package fu.se.a2.repositories;

import fu.se.a2.entities.Category;
import fu.se.a2.entities.NewsArticle;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.entities.Tag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RepositoriesTests {

    @Autowired
    private SystemAccountRepository accountRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    private SystemAccount adminAccount;
    private SystemAccount staffAccount;
    private Category techCategory;
    private Tag aiTag;

    @BeforeEach
    void setUp() {
        newsArticleRepository.deleteAll();
        categoryRepository.deleteAll();
        accountRepository.deleteAll();
        tagRepository.deleteAll();

        adminAccount = accountRepository.save(new SystemAccount(null, "Admin", "admin@funews.edu.vn", 1, "hash1"));
        staffAccount = accountRepository.save(new SystemAccount(null, "Staff1", "staff1@funews.edu.vn", 2, "hash2"));

        techCategory = categoryRepository.save(new Category(null, "Technology", "Tech articles", null, true));
        aiTag = tagRepository.save(new Tag(null, "AI", "Artificial Intelligence"));
    }

    @Test
    void testAccountRepositoryOperations() {
        assertThat(accountRepository.findByAccountEmail("admin@funews.edu.vn")).isPresent();
        assertThat(accountRepository.existsByAccountEmail("admin@funews.edu.vn")).isTrue();
        assertThat(accountRepository.existsByAccountEmail("nonexistent@funews.edu.vn")).isFalse();

        List<SystemAccount> searchResult = accountRepository.searchAccounts("staff", 2);
        assertThat(searchResult).hasSize(1);
        assertThat(searchResult.get(0).getAccountName()).isEqualTo("Staff1");
    }

    @Test
    void testCategoryAndNewsArticleRelationships() {
        NewsArticle article = new NewsArticle();
        article.setNewsTitle("Spring Boot 3 Released");
        article.setHeadline("Headline for Spring Boot 3");
        article.setNewsContent("Comprehensive content about Spring Boot 3");
        article.setNewsSource("FPT Edu");
        article.setCategory(techCategory);
        article.setNewsStatus("1");
        article.setCreatedBy(staffAccount);
        article.setCreatedDate(LocalDateTime.now());
        article.setTags(Set.of(aiTag));

        newsArticleRepository.save(article);

        // Verification of foreign key constraint queries
        assertThat(newsArticleRepository.existsByCreatedBy_AccountID(staffAccount.getAccountID())).isTrue();
        assertThat(newsArticleRepository.existsByCreatedBy_AccountID(adminAccount.getAccountID())).isFalse();

        assertThat(newsArticleRepository.existsByCategory_CategoryID(techCategory.getCategoryID())).isTrue();

        List<NewsArticle> publicNews = newsArticleRepository.searchPublicNews("Spring", null);
        assertThat(publicNews).hasSize(1);

        List<NewsArticle> staffHistory = newsArticleRepository.findByCreatedBy_AccountIDOrderByCreatedDateDesc(staffAccount.getAccountID());
        assertThat(staffHistory).hasSize(1);
    }
}
