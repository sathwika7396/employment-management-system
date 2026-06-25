package in.org.svcet.employee_management_system.repository;

import in.org.svcet.employee_management_system.entity.Task;
import in.org.svcet.employee_management_system.entity.TaskStatus;
import in.org.svcet.employee_management_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // 🔹 Tasks assigned to an employee
    List<Task> findByEmployee(User employee);

    // 🔹 Tasks by status (PENDING / COMPLETED)
    List<Task> findByStatus(TaskStatus status);

    // 🔹 Employee tasks by status
    List<Task> findByEmployeeAndStatus(User employee, TaskStatus status);
}
