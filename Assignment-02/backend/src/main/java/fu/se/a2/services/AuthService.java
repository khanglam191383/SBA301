package fu.se.a2.services;

import fu.se.a2.dtos.LoginRequest;
import fu.se.a2.dtos.LoginResponse;
import fu.se.a2.security.CustomUserDetails;
import fu.se.a2.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = tokenProvider.generateToken(userDetails);

        return new LoginResponse(
                token,
                userDetails.getAccountID(),
                userDetails.getAccountName(),
                userDetails.getAccountEmail(),
                userDetails.getAccountRole()
        );
    }
}
