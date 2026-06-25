package in.org.svcet.employee_management_system.controller;

import in.org.svcet.employee_management_system.entity.LeaveRequest;
import in.org.svcet.employee_management_system.entity.LeaveStatus;
import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.service.LeaveService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // ================= EMPLOYEE =================

    // Apply leave / permission
    @PostMapping("/apply")
    public LeaveRequest applyLeave(@RequestBody LeaveRequest leaveRequest) {
        return leaveService.applyLeave(leaveRequest);
    }

    // Employee views own leaves
    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getLeavesByEmployee(@PathVariable Long employeeId) {
        Employee employee = new Employee();
        employee.setId(employeeId);
        return leaveService.getLeavesByEmployee(employee);
    }

    // ================= HR =================

    // HR views all leaves
    @GetMapping("/all")
    public List<LeaveRequest> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    // HR approves leave
    @PutMapping("/approve/{leaveId}")
    public LeaveRequest approveLeave(@PathVariable Long leaveId) {
        return leaveService.approveLeave(leaveId);
    }

    // HR rejects leave
    @PutMapping("/reject/{leaveId}")
    public LeaveRequest rejectLeave(@PathVariable Long leaveId) {
        return leaveService.rejectLeave(leaveId);
    }

    // HR filter leaves by status
    @GetMapping("/status/{status}")
    public List<LeaveRequest> getLeavesByStatus(@PathVariable LeaveStatus status) {
        return leaveService.getLeavesByStatus(status);
    }
}
