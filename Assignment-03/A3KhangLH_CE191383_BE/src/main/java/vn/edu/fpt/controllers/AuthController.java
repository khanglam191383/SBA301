package vn.edu.fpt.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.dtos.AuthResponse;
import vn.edu.fpt.dtos.LoginRequest;
import vn.edu.fpt.dtos.MessageResponse;
import vn.edu.fpt.dtos.RegisterRequest;
import vn.edu.fpt.entity.Customer;
import vn.edu.fpt.services.IAuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Customer customer = authService.register(request);
            Map<String, Object> result = new HashMap<>();
            result.put("message", "Registration successful. You can now login.");
            result.put("email", customer.getEmailAddress());
            result.put("customerID", customer.getCustomerID());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(MessageResponse.error("Not authenticated"));
        }
        Map<String, Object> details = new HashMap<>();
        details.put("username", authentication.getName());
        details.put("authorities", authentication.getAuthorities());
        return ResponseEntity.ok(details);
    }
}

