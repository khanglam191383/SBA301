package fu.se.a2.dtos;

public class AccountDto {

    private Integer accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole; // 1: Admin, 2: Staff
    private boolean hasCreatedNews;

    public AccountDto() {
    }

    public AccountDto(Integer accountID, String accountName, String accountEmail, Integer accountRole) {
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
    }

    public Integer getAccountID() {
        return accountID;
    }

    public void setAccountID(Integer accountID) {
        this.accountID = accountID;
    }

    // Aliases for Frontend Compatibility
    public Integer getId() {
        return accountID;
    }

    public void setId(Integer id) {
        this.accountID = id;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getUsername() {
        return accountName;
    }

    public void setUsername(String username) {
        this.accountName = username;
    }

    public String getFullName() {
        return accountName;
    }

    public void setFullName(String fullName) {
        this.accountName = fullName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public String getEmail() {
        return accountEmail;
    }

    public void setEmail(String email) {
        this.accountEmail = email;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public Integer getRole() {
        return accountRole;
    }

    public void setRole(Integer role) {
        this.accountRole = role;
    }

    public int getStatus() {
        return 1; // Active
    }

    public boolean isHasCreatedNews() {
        return hasCreatedNews;
    }

    public void setHasCreatedNews(boolean hasCreatedNews) {
        this.hasCreatedNews = hasCreatedNews;
    }
}
