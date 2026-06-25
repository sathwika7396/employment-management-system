package in.org.svcet.employee_management_system.repository;

import in.org.svcet.employee_management_system.entity.LeaveRequest;
import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {

    // Employee: view own leaves
    List<LeaveRequest> findByEmployee(Employee employee);

    // HR: view by status
    List<LeaveRequest> findByStatus(LeaveStatus status);
}
