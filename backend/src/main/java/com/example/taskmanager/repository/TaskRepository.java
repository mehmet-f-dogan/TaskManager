package com.example.taskmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByProjectAndAssignedUserUsername(Project project, String username);

    boolean existsByProjectAndAssignedUserUsername(Project project, String username);

}
