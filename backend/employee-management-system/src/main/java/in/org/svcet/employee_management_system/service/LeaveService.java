package in.org.svcet.employee_management_system.service;

import in.org.svcet.employee_management_system.entity.LeaveRequest;
import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.entity.LeaveStatus;

import java.util.List;

public interface LeaveService {

    // Employee applies leave / permission
    LeaveRequest applyLeave(LeaveRequest leaveRequest);

    // Employee views own leave history
    List<LeaveRequest> getLeavesByEmployee(Employee employee);

    // HR views all leaves
    List<LeaveRequest> getAllLeaves();

    // HR approves leave
    LeaveRequest approveLeave(Long leaveId);

    // HR rejects leave
    LeaveRequest rejectLeave(Long leaveId);

    // HR views leaves by status
    List<LeaveRequest> getLeavesByStatus(LeaveStatus status);
}
