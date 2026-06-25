package in.org.svcet.employee_management_system.service.impl;

import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.entity.Status;
import in.org.svcet.employee_management_system.repository.EmployeeRepository;
import in.org.svcet.employee_management_system.service.EmployeeService;
import in.org.svcet.employee_management_system.service.MailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final MailService mailService;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               MailService mailService) {
        this.employeeRepository = employeeRepository;
        this.mailService = mailService;
    }

    // HR creates employee
    @Override
    public Employee createEmployee(Employee employee) {
        employee.setStatus(Status.ACTIVE);
        employee.setCreatedDate(LocalDateTime.now());

        Employee savedEmployee = employeeRepository.save(employee);

        // Mail only to employee (HR mail is single & fixed)
        mailService.sendMail(
                savedEmployee.getEmail(),
                "Welcome to Company",
                "Hello " + savedEmployee.getName() +
                        ",\n\nYour employee account is created successfully."
        );

        return savedEmployee;
    }

    // HR updates employee
    @Override
    public Employee updateEmployee(Long id, Employee employee) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existing.setName(employee.getName());
        existing.setEmail(employee.getEmail());
        existing.setDepartment(employee.getDepartment());
        existing.setDesignation(employee.getDesignation());
        existing.setUpdatedDate(LocalDateTime.now());

        return employeeRepository.save(existing);
    }

    // Soft delete (ACTIVE / INACTIVE)
    @Override
    public void changeEmployeeStatus(Long id, Status status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setStatus(status);
        employee.setUpdatedDate(LocalDateTime.now());
        employeeRepository.save(employee);
    }

    // HR view all
    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Filter by status
    @Override
    public List<Employee> getEmployeesByStatus(Status status) {
        return employeeRepository.findByStatus(status);
    }

    // View profile
    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }
}
