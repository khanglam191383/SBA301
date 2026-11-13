package vn.edu.fpt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import vn.edu.fpt.dtos.CustomerProfileRequest;
import vn.edu.fpt.dtos.CustomerRequest;
import vn.edu.fpt.entity.Customer;
import vn.edu.fpt.repositories.ICustomerRepository;

import java.util.List;

@Service
public class CustomerService implements ICustomerService {

    @Autowired
    private ICustomerRepository customerRepository;

    @Override
    public List<Customer> getAllCustomers(String keyword) {
        if (StringUtils.hasText(keyword)) {
            return customerRepository.searchCustomers(keyword.trim());
        }
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    @Override
    public Customer createCustomer(CustomerRequest request) {
        String email = request.getEmailAddress().trim();
        if (customerRepository.existsByEmailAddress(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone());
        customer.setEmailAddress(email);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus(request.getCustomerStatus() != null ? request.getCustomerStatus() : (byte) 1);
        customer.setPassword(StringUtils.hasText(request.getPassword()) ? request.getPassword().trim() : "123456");

        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Integer id, CustomerRequest request) {
        Customer customer = getCustomerById(id);

        String email = request.getEmailAddress().trim();
        if (!email.equalsIgnoreCase(customer.getEmailAddress()) && customerRepository.existsByEmailAddress(email)) {
            throw new RuntimeException("Email is already used by another customer: " + email);
        }

        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone());
        customer.setEmailAddress(email);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        if (request.getCustomerStatus() != null) {
            customer.setCustomerStatus(request.getCustomerStatus());
        }
        if (StringUtils.hasText(request.getPassword())) {
            customer.setPassword(request.getPassword().trim());
        }

        return customerRepository.save(customer);
    }

    @Override
    public void deleteCustomer(Integer id) {
        Customer customer = getCustomerById(id);
        // Soft delete / change status or hard delete
        customer.setCustomerStatus((byte) 2); // 2: Inactive
        customerRepository.save(customer);
    }

    @Override
    public Customer getProfile(String email) {
        return customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("Customer profile not found for email: " + email));
    }

    @Override
    public Customer updateProfile(String email, CustomerProfileRequest request) {
        Customer customer = getProfile(email);

        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone());
        customer.setCustomerBirthday(request.getCustomerBirthday());
        if (StringUtils.hasText(request.getPassword())) {
            customer.setPassword(request.getPassword().trim());
        }

        return customerRepository.save(customer);
    }
}

