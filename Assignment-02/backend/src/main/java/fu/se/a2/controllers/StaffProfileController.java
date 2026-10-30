package fu.se.a2.controllers;

import fu.se.a2.dtos.ProfileDto;
import fu.se.a2.dtos.UpdateProfileRequest;
import fu.se.a2.security.CustomUserDetails;
import fu.se.a2.services.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff/profile")
public class StaffProfileController {

    private final ProfileService profileService;

    public StaffProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        ProfileDto profile = profileService.getProfile(userDetails.getAccountID());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<ProfileDto> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest req) {
        ProfileDto updated = profileService.updateProfile(userDetails.getAccountID(), req);
        return ResponseEntity.ok(updated);
    }
}
