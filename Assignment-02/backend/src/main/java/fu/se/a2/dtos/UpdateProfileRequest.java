package fu.se.a2.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name cannot exceed 100 characters")
    private String accountName;

    @Size(min = 4, max = 50, message = "Password must be between 4 and 50 characters")
    private String password; // Optional if user doesn't want to change password

    public UpdateProfileRequest() {
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public void setFullName(String fullName) {
        if (this.accountName == null) this.accountName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
