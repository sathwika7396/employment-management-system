package in.org.svcet.employee_management_system.service.impl;

import in.org.svcet.employee_management_system.entity.LeaveRequest;
import in.org.svcet.employee_management_system.entity.Employee;
import in.org.svcet.employee_management_system.entity.LeaveStatus;
import in.org.svcet.employee_management_system.repository.LeaveRepository;
import in.org.svcet.employee_management_system.service.LeaveService;
import in.org.svcet.employee_management_system.service.MailService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;
    private final MailService mailService;

    public LeaveServiceImpl(LeaveRepository leaveRepository,
                            MailService mailService) {
        this.leaveRepository = leaveRepository;
        this.mailService = mailService;
    }

    // ================= EMPLOYEE =================

    @Override
    public LeaveRequest applyLeave(LeaveRequest leaveRequest) {
        leaveRequest.setStatus(LeaveStatus.PENDING);
        return leaveRepository.save(leaveRequest);
    }

    @Override
    public List<LeaveRequest> getLeavesByEmployee(Employee employee) {
        return leaveRepository.findByEmployee(employee);
    }

    // ================= HR =================

    @Override
    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }

    @Override
    public LeaveRequest approveLeave(Long leaveId) {
        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        leave.setStatus(LeaveStatus.APPROVED);
        LeaveRequest savedLeave = leaveRepository.save(leave);

        // Email only to employee (HR has fixed email)
        mailService.sendMail(
                leave.getEmployee().getEmail(),
                "Leave Approved",
                "Your leave request has been approved by HR."
        );

        return savedLeave;
    }

    @Override
    public LeaveRequest rejectLeave(Long leaveId) {
        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        leave.setStatus(LeaveStatus.REJECTED);

        mailService.sendMail(
                leave.getEmployee().getEmail(),
                "Leave Rejected",
                "Your leave request has been rejected. Please contact HR."
        );

        return leaveRepository.save(leave);
    }

    @Override
    public List<LeaveRequest> getLeavesByStatus(LeaveStatus status) {
        return leaveRepository.findByStatus(status);
    }
}
