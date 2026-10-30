package fu.se.a2.security;

import fu.se.a2.entities.SystemAccount;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final Integer accountID;
    private final String accountName;
    private final String accountEmail;
    private final String accountPassword;
    private final Integer accountRole;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(SystemAccount account) {
        this.accountID = account.getAccountID();
        this.accountName = account.getAccountName();
        this.accountEmail = account.getAccountEmail();
        this.accountPassword = account.getAccountPassword();
        this.accountRole = account.getAccountRole();

        String roleName = (account.getAccountRole() == 1) ? "ROLE_ADMIN" : "ROLE_STAFF";
        this.authorities = List.of(new SimpleGrantedAuthority(roleName));
    }

    public Integer getAccountID() {
        return accountID;
    }

    public String getAccountName() {
        return accountName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return accountPassword;
    }

    @Override
    public String getUsername() {
        return accountEmail; // Authentication identifier is email
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
