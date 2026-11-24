import type { Task, TaskCreate, TaskStatus, TaskUpdate } from '../types/task'
import Axios from 'axios'

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

const TASKS_PATH = '/api/tasks'

export const getTasks = async (status?: TaskStatus): Promise<Task[]> => {
  const response = await api.get<Task[]>(TASKS_PATH, { params: { status } });
  return response.data;
}

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await api.get<Task>(`${TASKS_PATH}/${id}`);
  return response.data;
}

export const createTask = async (data: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>(TASKS_PATH, data);
  return response.data;
}

export const updateTask = async (id: number, data: TaskUpdate): Promise<Task> => {
  const response = await api.put<Task>(`${TASKS_PATH}/${id}`, data);
  return response.data;
}

export const updateTaskStatus = async (id: number, status: TaskStatus): Promise<Task> => {
  const response = await api.patch<Task>(`${TASKS_PATH}/${id}/status`, { status: status });
  return response.data;
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`${TASKS_PATH}/${id}`);

}
