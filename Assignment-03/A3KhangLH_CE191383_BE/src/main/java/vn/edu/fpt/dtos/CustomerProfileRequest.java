package vn.edu.fpt.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CustomerProfileRequest {
    @NotBlank(message = "Customer full name is required")
    @Size(max = 50, message = "Full name cannot exceed 50 characters")
    private String customerFullName;

    @Size(max = 12, message = "Telephone cannot exceed 12 characters")
    private String telephone;

    private LocalDate customerBirthday;

    private String password;

    public CustomerProfileRequest() {
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

