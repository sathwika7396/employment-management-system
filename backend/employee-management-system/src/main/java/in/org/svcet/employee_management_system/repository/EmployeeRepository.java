package in.org.svcet.employee_management_system.repository;

import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Get only ACTIVE employees (soft delete support)
    List<Employee> findByStatus(Status status);

    // Find employee by email
    Optional<Employee> findByEmail(String email);
}
