package in.org.svcet.employee_management_system.service.impl;

import in.org.svcet.employee_management_system.entity.Task;
import in.org.svcet.employee_management_system.entity.TaskStatus;
import in.org.svcet.employee_management_system.entity.User;
import in.org.svcet.employee_management_system.repository.TaskRepository;
import in.org.svcet.employee_management_system.service.TaskService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // HR assigns task
    @Override
    public Task assignTask(Task task) {
        task.setStatus(TaskStatus.ASSIGNED);
        task.setCreatedDate(LocalDateTime.now());
        task.setUpdatedDate(LocalDateTime.now());
        return taskRepository.save(task);
    }

    // Employee views own tasks
    @Override
    public List<Task> getTasksByEmployee(User employee) {
        return taskRepository.findByEmployee(employee);
    }

    // Employee updates task status
    @Override
    public Task updateTaskStatus(Long taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(status);
        task.setUpdatedDate(LocalDateTime.now());
        return taskRepository.save(task);
    }

    // HR views tasks by status
    @Override
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }
}
