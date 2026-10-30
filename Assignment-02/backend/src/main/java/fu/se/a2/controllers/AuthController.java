package fu.se.a2.controllers;

import fu.se.a2.dtos.LoginRequest;
import fu.se.a2.dtos.LoginResponse;
import fu.se.a2.dtos.ProfileDto;
import fu.se.a2.security.CustomUserDetails;
import fu.se.a2.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ProfileDto profile = new ProfileDto(
                userDetails.getAccountID(),
                userDetails.getAccountName(),
                userDetails.getAccountEmail(),
                userDetails.getAccountRole()
        );
        return ResponseEntity.ok(profile);
    }
}
