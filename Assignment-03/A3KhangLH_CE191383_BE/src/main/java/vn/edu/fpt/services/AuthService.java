package vn.edu.fpt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.fpt.dtos.AuthResponse;
import vn.edu.fpt.dtos.LoginRequest;
import vn.edu.fpt.dtos.RegisterRequest;
import vn.edu.fpt.entity.Customer;
import vn.edu.fpt.repositories.ICustomerRepository;
import vn.edu.fpt.security.JwtUtils;

@Service
public class AuthService implements IAuthService {

    @Value("${admin.email:staff@fpt.edu.vn}")
    private String adminEmail;

    @Value("${admin.password:staff123}")
    private String adminPassword;

    @Value("${admin.fullname:Hotel Staff}")
    private String adminFullName;

    @Autowired
    private ICustomerRepository customerRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim();
        String password = request.getPassword().trim();

        // 1. Check if login as Staff from application.properties
        if (adminEmail.equalsIgnoreCase(email)) {
            if (adminPassword.equals(password)) {
                String token = jwtUtils.generateToken(adminEmail, "Staff", null, adminFullName);
                return new AuthResponse(token, adminEmail, adminFullName, "Staff", null);
            } else {
                throw new RuntimeException("Invalid staff password");
            }
        }

        // 2. Check if login as Customer in database
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("Email not registered in the system"));

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 2) {
            throw new RuntimeException("Account is inactive or disabled");
        }

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtils.generateToken(customer.getEmailAddress(), "Customer",
                customer.getCustomerID(), customer.getCustomerFullName());

        return new AuthResponse(token, customer.getEmailAddress(), customer.getCustomerFullName(),
                "Customer", customer.getCustomerID());
    }

    @Override
    public Customer register(RegisterRequest request) {
        String email = request.getEmailAddress().trim();

        if (adminEmail.equalsIgnoreCase(email)) {
            throw new RuntimeException("This email is reserved for staff account");
        }

        if (customerRepository.existsByEmailAddress(email)) {
            throw new RuntimeException("Email already registered: " + email);
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getFullName().trim());
        customer.setTelephone(request.getTelephone() != null ? request.getTelephone().trim() : null);
        customer.setEmailAddress(email);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus((byte) 1);
        customer.setPassword(request.getPassword().trim()); // Can be stored plain or encoded

        return customerRepository.save(customer);
    }
}

