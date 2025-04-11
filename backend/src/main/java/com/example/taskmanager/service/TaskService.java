package com.example.taskmanager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.taskmanager.dto.request.TaskRequest;
import com.example.taskmanager.dto.response.TaskResponse;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.ProjectRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        if (!project.getOwner().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Project not found with id: " + request.getProjectId());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .project(project)
                .assignedUser(currentUser)
                .createdAt(LocalDateTime.now())
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToTaskResponse(savedTask);
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isOwner = project.getOwner().getUsername().equals(username);
        boolean isAssignedUser = taskRepository.existsByProjectAndAssignedUserUsername(project, username);

        if (!isOwner && !isAssignedUser) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }

        List<Task> tasks = isOwner
                ? taskRepository.findByProject(project)
                : taskRepository.findByProjectAndAssignedUserUsername(project, username);

        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isOwner = task.getProject().getOwner().getUsername().equals(username);
        boolean isAssignedUser = task.getAssignedUser().getUsername().equals(username);

        if (!isOwner && !isAssignedUser) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }

        return mapToTaskResponse(task);
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!task.getProject().getOwner().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setAssignedUser(currentUser);
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponse(updatedTask);
    }

    public TaskResponse updateTaskStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!task.getAssignedUser().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }

        try {
            TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
            task.setStatus(taskStatus);
            task.setUpdatedAt(LocalDateTime.now());

            Task updatedTask = taskRepository.save(task);
            return mapToTaskResponse(updatedTask);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid task status: " + status);
        }
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!task.getProject().getOwner().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }

        taskRepository.delete(task);
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .projectId(task.getProject().getId())
                .assignedUserId(task.getAssignedUser().getId())
                .assignedUserName(task.getAssignedUser().getUsername())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}