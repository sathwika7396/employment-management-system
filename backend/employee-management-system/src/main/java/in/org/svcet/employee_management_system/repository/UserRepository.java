package in.org.svcet.employee_management_system.repository;

import in.org.svcet.employee_management_system.entity.User;
import in.org.svcet.employee_management_system.entity.Role;
import in.org.svcet.employee_management_system.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Login
    Optional<User> findByEmail(String email);

    // Soft delete support
    List<User> findByStatus(Status status);

    // Role based users (HR / EMPLOYEE)
    List<User> findByRole(Role role);
}
