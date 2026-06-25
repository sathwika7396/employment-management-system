package in.org.svcet.employee_management_system.controller;

import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.entity.Status;
import in.org.svcet.employee_management_system.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // HR: create employee
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.createEmployee(employee);
    }

    // HR: update employee
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id,
                                   @RequestBody Employee employee) {
        return employeeService.updateEmployee(id, employee);
    }

    // HR: soft delete (ACTIVE / INACTIVE)
    @PatchMapping("/{id}/status")
    public void changeStatus(@PathVariable Long id,
                             @RequestParam Status status) {
        employeeService.changeEmployeeStatus(id, status);
    }

    // HR: view all employees
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // HR: view by status
    @GetMapping("/status/{status}")
    public List<Employee> getByStatus(@PathVariable Status status) {
        return employeeService.getEmployeesByStatus(status);
    }

    // HR / Employee: view profile
    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }
}
