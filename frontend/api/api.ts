"use server"

export type AuthResponse = {
    token: string
}

export type RegisterResponse = AuthResponse

export type LoginResponse = AuthResponse

export async function register(credentials: { username: string; password: string }): Promise<RegisterResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + '/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function login(credentials: { username: string; password: string }): Promise<LoginResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export type ProjectRequest = {
    name: string,
    description: string
}

export type CreateProjectRequest = ProjectRequest

export type UpdateProjectRequest = ProjectRequest

export type ProjectResponse = {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
}

export type CreateProjectResponse = ProjectResponse

export type GetAllProjectsResponse = ProjectResponse[]

export type GetProjectByIdResponse = ProjectResponse

export type UpdateProjectResponse = ProjectResponse

export async function createProject(token: string, projectData: CreateProjectRequest): Promise<CreateProjectResponse | null> {
    console.log(process.env.API_URL)
    try {
        const response = await fetch(process.env.API_URL + '/api/projects', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        })
        console.log(token)

        console.log(response)

        if (response.ok) {
            return response.json()
        }
    } catch (error) {
        console.log(error);

    }
    return null
}

export async function getAllProjects(token: string): Promise<GetAllProjectsResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + '/api/projects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function getProjectById(token: string, id: number): Promise<GetProjectByIdResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + `/api/projects/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function updateProject(token: string, id: number, projectData: UpdateProjectRequest): Promise<UpdateProjectResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + `/api/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function deleteProject(token: string, id: number): Promise<boolean> {
    try {
        const response = await fetch(process.env.API_URL + `/api/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            return true
        }
    } catch (error) { }
    return false
}

export type TaskRequest = {
    title: string;
    description: string;
    projectId: number;
};

export type CreateTaskRequest = TaskRequest

export type UpdateTaskRequest = TaskRequest

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"

export type TaskResponse = {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    projectId: number;
    assignedUserId: number;
    assignedUserName: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateTaskResponse = TaskResponse

export type GetTasksByProjectResponse = TaskResponse[]

export type GetTaskByIdResponse = TaskResponse

export type UpdateTaskResponse = TaskResponse

export type UpdateTaskStatusResponse = TaskResponse

export async function createTask(token: string, taskData: CreateTaskRequest): Promise<CreateTaskResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + '/api/tasks', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function getTasksByProjectId(token: string, projectId: number): Promise<GetTasksByProjectResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + `/api/tasks/project/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function getTaskById(token: string, id: number): Promise<GetTaskByIdResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + `/api/tasks/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function updateTask(token: string, id: number, taskData: UpdateTaskRequest): Promise<UpdateTaskResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + `/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function updateTaskStatus(token: string, id: number, taskStatus: TaskStatus): Promise<UpdateTaskStatusResponse | null> {
    try {
        const response = await fetch(process.env.API_URL + `/api/tasks/${id}/status/${taskStatus}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            return response.json()
        }
    } catch (error) { }
    return null
}

export async function deleteTask(token: string, id: number): Promise<boolean> {
    try {
        const response = await fetch(process.env.API_URL + `/api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            return true
        }
    } catch (error) { }
    return false
}