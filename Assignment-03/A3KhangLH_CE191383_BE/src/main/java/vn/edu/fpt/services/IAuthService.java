package vn.edu.fpt.services;

import vn.edu.fpt.dtos.AuthResponse;
import vn.edu.fpt.dtos.LoginRequest;
import vn.edu.fpt.dtos.RegisterRequest;
import vn.edu.fpt.entity.Customer;

public interface IAuthService {
    AuthResponse login(LoginRequest request);
    Customer register(RegisterRequest request);
}

