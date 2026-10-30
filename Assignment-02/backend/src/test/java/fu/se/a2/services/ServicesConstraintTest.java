package fu.se.a2.services;

import fu.se.a2.entities.Category;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.exceptions.ConflictException;
import fu.se.a2.repositories.CategoryRepository;
import fu.se.a2.repositories.NewsArticleRepository;
import fu.se.a2.repositories.SystemAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServicesConstraintTest {

    @Mock
    private SystemAccountRepository accountRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private NewsArticleRepository newsArticleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AccountService accountService;

    @InjectMocks
    private CategoryService categoryService;

    private SystemAccount sampleAccount;
    private Category sampleCategory;

    @BeforeEach
    void setUp() {
        sampleAccount = new SystemAccount(10, "Staff Member", "staff10@funews.edu.vn", 2, "hash");
        sampleCategory = new Category(20, "Academic", "Academic Desc", null, true);
    }

    @Test
    void testAccountDeleteFailsWhenHasCreatedNews() {
        when(accountRepository.findById(10)).thenReturn(Optional.of(sampleAccount));
        when(newsArticleRepository.existsByCreatedBy_AccountID(10)).thenReturn(true);

        assertThatThrownBy(() -> accountService.deleteAccount(10))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Cannot delete account because it has created news articles");

        verify(accountRepository, never()).delete(any());
    }

    @Test
    void testAccountDeleteSucceedsWhenNoNewsCreated() {
        when(accountRepository.findById(10)).thenReturn(Optional.of(sampleAccount));
        when(newsArticleRepository.existsByCreatedBy_AccountID(10)).thenReturn(false);

        accountService.deleteAccount(10);

        verify(accountRepository, times(1)).delete(sampleAccount);
    }

    @Test
    void testCategoryDeleteFailsWhenContainsNews() {
        when(categoryRepository.findById(20)).thenReturn(Optional.of(sampleCategory));
        when(newsArticleRepository.existsByCategory_CategoryID(20)).thenReturn(true);

        assertThatThrownBy(() -> categoryService.deleteCategory(20))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Cannot delete category because it contains news articles");

        verify(categoryRepository, never()).delete(any());
    }

    @Test
    void testCategoryDeleteSucceedsWhenNoNews() {
        when(categoryRepository.findById(20)).thenReturn(Optional.of(sampleCategory));
        when(newsArticleRepository.existsByCategory_CategoryID(20)).thenReturn(false);

        categoryService.deleteCategory(20);

        verify(categoryRepository, times(1)).delete(sampleCategory);
    }
}
