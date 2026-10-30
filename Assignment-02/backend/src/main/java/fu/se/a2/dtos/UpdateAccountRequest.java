package fu.se.a2.dtos;

import jakarta.validation.constraints.*;

public class UpdateAccountRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name cannot exceed 100 characters")
    private String accountName;

    @NotBlank(message = "Account email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String accountEmail;

    @NotNull(message = "Account role is required")
    @Min(value = 1, message = "Role must be 1 (Admin) or 2 (Staff)")
    @Max(value = 2, message = "Role must be 1 (Admin) or 2 (Staff)")
    private Integer accountRole;

    @Size(min = 4, max = 50, message = "Password must be between 4 and 50 characters")
    private String accountPassword; // Optional on update

    public UpdateAccountRequest() {
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public void setUsername(String username) {
        if (this.accountName == null) this.accountName = username;
    }

    public void setFullName(String fullName) {
        if (this.accountName == null) this.accountName = fullName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public void setEmail(String email) {
        if (this.accountEmail == null) this.accountEmail = email;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public void setRole(Integer role) {
        if (this.accountRole == null) this.accountRole = role;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }

    public void setPassword(String password) {
        if (this.accountPassword == null) this.accountPassword = password;
    }
}
