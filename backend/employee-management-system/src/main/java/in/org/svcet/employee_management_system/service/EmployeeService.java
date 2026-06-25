package in.org.svcet.employee_management_system.service;

import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.entity.Status;

import java.util.List;

public interface EmployeeService {

    // HR creates employee
    Employee createEmployee(Employee employee);

    // HR updates employee
    Employee updateEmployee(Long id, Employee employee);

    // HR soft deletes employee
    void changeEmployeeStatus(Long id, Status status);

    // HR view all employees
    List<Employee> getAllEmployees();

    // HR view only active employees
    List<Employee> getEmployeesByStatus(Status status);

    // HR / Employee view profile
    Employee getEmployeeById(Long id);
}
