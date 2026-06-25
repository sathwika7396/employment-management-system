package in.org.svcet.employee_management_system.service;

import in.org.svcet.employee_management_system.entity.User;

public interface AuthService {

    // Register HR or Employee
    User register(User user);

    // Login with email + password
    User login(String email, String password);
}
