package fu.se.a2.services;

import fu.se.a2.dtos.AccountDto;
import fu.se.a2.dtos.CreateAccountRequest;
import fu.se.a2.dtos.UpdateAccountRequest;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.exceptions.ConflictException;
import fu.se.a2.exceptions.ResourceNotFoundException;
import fu.se.a2.repositories.NewsArticleRepository;
import fu.se.a2.repositories.SystemAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(SystemAccountRepository accountRepository,
                          NewsArticleRepository newsArticleRepository,
                          PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AccountDto> getAllAccounts(String keyword, Integer role) {
        List<SystemAccount> accounts = accountRepository.searchAccounts(keyword, role);
        return accounts.stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public AccountDto getAccountById(Integer id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));
        return mapToDto(account);
    }

    public AccountDto createAccount(CreateAccountRequest req) {
        if (accountRepository.existsByAccountEmail(req.getAccountEmail())) {
            throw new ConflictException("Email '" + req.getAccountEmail() + "' is already registered in the system.");
        }

        SystemAccount account = new SystemAccount();
        account.setAccountName(req.getAccountName());
        account.setAccountEmail(req.getAccountEmail());
        account.setAccountRole(req.getAccountRole());
        account.setAccountPassword(passwordEncoder.encode(req.getAccountPassword()));

        SystemAccount saved = accountRepository.save(account);
        return mapToDto(saved);
    }

    public AccountDto updateAccount(Integer id, UpdateAccountRequest req) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        if (accountRepository.existsByAccountEmailAndAccountIDNot(req.getAccountEmail(), id)) {
            throw new ConflictException("Email '" + req.getAccountEmail() + "' is already taken by another account.");
        }

        account.setAccountName(req.getAccountName());
        account.setAccountEmail(req.getAccountEmail());
        account.setAccountRole(req.getAccountRole());

        if (req.getAccountPassword() != null && !req.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(passwordEncoder.encode(req.getAccountPassword().trim()));
        }

        SystemAccount updated = accountRepository.save(account);
        return mapToDto(updated);
    }

    public void deleteAccount(Integer id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        // Business Rule: Delete action will delete an account in the case this account has NOT created any news articles
        if (newsArticleRepository.existsByCreatedBy_AccountID(id)) {
            throw new ConflictException("Cannot delete account because it has created news articles.");
        }

        accountRepository.delete(account);
    }

    private AccountDto mapToDto(SystemAccount account) {
        AccountDto dto = new AccountDto(
                account.getAccountID(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole()
        );
        dto.setHasCreatedNews(newsArticleRepository.existsByCreatedBy_AccountID(account.getAccountID()));
        return dto;
    }
}
