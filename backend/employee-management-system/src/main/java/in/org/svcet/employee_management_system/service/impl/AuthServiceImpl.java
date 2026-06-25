package in.org.svcet.employee_management_system.service.impl;

import in.org.svcet.employee_management_system.entity.Role;
import in.org.svcet.employee_management_system.entity.Status;
import in.org.svcet.employee_management_system.entity.User;
import in.org.svcet.employee_management_system.repository.UserRepository;
import in.org.svcet.employee_management_system.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER USER (HR / EMPLOYEE)
    @Override
    public User register(User user) {

        // check email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // default status
        user.setStatus(Status.ACTIVE);

        // default role if not provided
        if (user.getRole() == null) {
            user.setRole(Role.EMPLOYEE);
        }

        return userRepository.save(user);
    }

    // LOGIN USER
    @Override
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (user.getStatus() == Status.INACTIVE) {
            throw new RuntimeException("User is inactive");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
