package fu.se.a2.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import fu.se.a2.dtos.CreateAccountRequest;
import fu.se.a2.dtos.NewsArticleRequest;
import fu.se.a2.entities.Category;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.repositories.CategoryRepository;
import fu.se.a2.repositories.NewsArticleRepository;
import fu.se.a2.repositories.SystemAccountRepository;
import fu.se.a2.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ControllersIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SystemAccountRepository accountRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String staffToken;
    private SystemAccount adminUser;
    private SystemAccount staffUser;
    private Category activeCategory;

    @BeforeEach
    void setUp() {
        newsArticleRepository.deleteAll();
        categoryRepository.deleteAll();
        accountRepository.deleteAll();

        adminUser = new SystemAccount(null, "Admin", "admin@funews.edu.vn", 1, passwordEncoder.encode("AdminPass"));
        adminUser = accountRepository.save(adminUser);
        adminToken = "Bearer " + tokenProvider.generateToken(new fu.se.a2.security.CustomUserDetails(adminUser));

        staffUser = new SystemAccount(null, "Staff", "staff@funews.edu.vn", 2, passwordEncoder.encode("StaffPass"));
        staffUser = accountRepository.save(staffUser);
        staffToken = "Bearer " + tokenProvider.generateToken(new fu.se.a2.security.CustomUserDetails(staffUser));

        activeCategory = categoryRepository.save(new Category(null, "Tech Trends", "Tech trends category", null, true));
    }

    @Test
    void testPublicNewsEndpointsAccessibleWithoutAuth() throws Exception {
        // Create an active news article using staff
        NewsArticleRequest req = new NewsArticleRequest();
        req.setNewsTitle("Public Announcement");
        req.setHeadline("Headline for public");
        req.setNewsContent("Content visible to the entire public.");
        req.setCategoryID(activeCategory.getCategoryID());
        req.setNewsStatus("1"); // Active
        req.setTagNames(List.of("Public", "News"));

        mockMvc.perform(post("/api/staff/news")
                        .header("Authorization", staffToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // Call public endpoint with NO authorization header
        mockMvc.perform(get("/api/public/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].newsTitle").value("Public Announcement"));

        mockMvc.perform(get("/api/public/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testAdminOnlyEndpointsRejectStaff() throws Exception {
        mockMvc.perform(get("/api/admin/accounts")
                        .header("Authorization", staffToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminCanCreateAccount() throws Exception {
        CreateAccountRequest req = new CreateAccountRequest();
        req.setAccountName("New Staff Member");
        req.setAccountEmail("newstaff@funews.edu.vn");
        req.setAccountRole(2);
        req.setAccountPassword("SecurePass123");

        mockMvc.perform(post("/api/admin/accounts")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountEmail").value("newstaff@funews.edu.vn"))
                .andExpect(jsonPath("$.accountRole").value(2));
    }
}
