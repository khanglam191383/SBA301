package fu.se.a2.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "SystemAccount")
public class SystemAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID")
    private Integer accountID;

    @Column(name = "AccountName", length = 100)
    private String accountName;

    @Column(name = "AccountEmail", length = 150, unique = true, nullable = false)
    private String accountEmail;

    @Column(name = "AccountRole", nullable = false)
    private Integer accountRole; // 1: Admin, 2: Staff

    @Column(name = "AccountPassword", length = 255, nullable = false)
    private String accountPassword;

    public SystemAccount() {
    }

    public SystemAccount(Integer accountID, String accountName, String accountEmail, Integer accountRole, String accountPassword) {
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        this.accountPassword = accountPassword;
    }

    public Integer getAccountID() {
        return accountID;
    }

    public void setAccountID(Integer accountID) {
        this.accountID = accountID;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }
}
