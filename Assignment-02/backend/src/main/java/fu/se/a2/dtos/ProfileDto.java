package fu.se.a2.dtos;

public class ProfileDto {

    private Integer accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;

    public ProfileDto() {
    }

    public ProfileDto(Integer accountID, String accountName, String accountEmail, Integer accountRole) {
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

    public Integer getId() {
        return accountID;
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

    public String getFullName() {
        return accountName;
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

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public Integer getRole() {
        return accountRole;
    }
}
