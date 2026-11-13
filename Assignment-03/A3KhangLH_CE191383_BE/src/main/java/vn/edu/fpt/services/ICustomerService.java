package vn.edu.fpt.services;

import vn.edu.fpt.dtos.CustomerProfileRequest;
import vn.edu.fpt.dtos.CustomerRequest;
import vn.edu.fpt.entity.Customer;

import java.util.List;

public interface ICustomerService {
    List<Customer> getAllCustomers(String keyword);
    Customer getCustomerById(Integer id);
    Customer createCustomer(CustomerRequest request);
    Customer updateCustomer(Integer id, CustomerRequest request);
    void deleteCustomer(Integer id);

    Customer getProfile(String email);
    Customer updateProfile(String email, CustomerProfileRequest request);
}

