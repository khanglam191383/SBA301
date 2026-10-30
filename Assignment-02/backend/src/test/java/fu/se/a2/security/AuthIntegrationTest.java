package fu.se.a2.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import fu.se.a2.dtos.LoginRequest;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.repositories.SystemAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SystemAccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        accountRepository.deleteAll();
        SystemAccount admin = new SystemAccount();
        admin.setAccountName("Admin User");
        admin.setAccountEmail("admin@funews.edu.vn");
        admin.setAccountRole(1);
        admin.setAccountPassword(passwordEncoder.encode("AdminPass123"));
        accountRepository.save(admin);
    }

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("admin@funews.edu.vn", "AdminPass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.accountEmail").value("admin@funews.edu.vn"))
                .andExpect(jsonPath("$.accountRole").value(1));
    }

    @Test
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("admin@funews.edu.vn", "WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void testLoginValidationFailed() throws Exception {
        LoginRequest request = new LoginRequest("not-an-email", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }
}
