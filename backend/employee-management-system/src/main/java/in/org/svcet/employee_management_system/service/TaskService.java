package in.org.svcet.employee_management_system.service;

import in.org.svcet.employee_management_system.entity.Task;
import in.org.svcet.employee_management_system.entity.TaskStatus;
import in.org.svcet.employee_management_system.entity.User;

import java.util.List;

public interface TaskService {

    // HR assigns task
    Task assignTask(Task task);

    // Employee views own tasks
    List<Task> getTasksByEmployee(User employee);

    // Employee marks task completed
    Task updateTaskStatus(Long taskId, TaskStatus status);

    // HR views tasks by status
    List<Task> getTasksByStatus(TaskStatus status);
}
