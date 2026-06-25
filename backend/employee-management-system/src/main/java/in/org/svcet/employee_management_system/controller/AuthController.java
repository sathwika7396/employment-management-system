package in.org.svcet.employee_management_system.controller;

import in.org.svcet.employee_management_system.entity.User;
import in.org.svcet.employee_management_system.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // frontend later
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER (HR / EMPLOYEE)
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    // LOGIN
    @PostMapping("/login")
    public User login(@RequestParam String email,
                      @RequestParam String password) {
        return authService.login(email, password);
    }
}
