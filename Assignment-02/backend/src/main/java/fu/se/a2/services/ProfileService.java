package fu.se.a2.services;

import fu.se.a2.dtos.ProfileDto;
import fu.se.a2.dtos.UpdateProfileRequest;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.exceptions.ResourceNotFoundException;
import fu.se.a2.repositories.SystemAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProfileService {

    private final SystemAccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(SystemAccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfile(Integer currentUserId) {
        SystemAccount account = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + currentUserId));
        return new ProfileDto(account.getAccountID(), account.getAccountName(), account.getAccountEmail(), account.getAccountRole());
    }

    public ProfileDto updateProfile(Integer currentUserId, UpdateProfileRequest req) {
        SystemAccount account = accountRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + currentUserId));

        account.setAccountName(req.getAccountName());

        if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
            account.setAccountPassword(passwordEncoder.encode(req.getPassword().trim()));
        }

        SystemAccount updated = accountRepository.save(account);
        return new ProfileDto(updated.getAccountID(), updated.getAccountName(), updated.getAccountEmail(), updated.getAccountRole());
    }
}
