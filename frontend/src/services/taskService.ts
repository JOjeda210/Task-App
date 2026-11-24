import type { Task, TaskCreate, TaskStatus, TaskUpdate } from '../types/task'
import Axios from 'axios'

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

const TASKS_PATH = '/api/tasks'
export async function getTasks(status?: TaskStatus): Promise<Task[]> {
  const response = await api.get<Task[]>(TASKS_PATH, { params: { status } });
  return response.data
}

export async function getTaskById(id: number): Promise<Task> {
  const response = await api.get<Task>(`${TASKS_PATH}/${id}`);
  return response.data;
}

export async function createTask(data: TaskCreate): Promise<Task> {
  const response = await api.post<Task>(TASKS_PATH, data);
  return response.data;
}

export async function updateTask(id: number, data: TaskUpdate): Promise<Task> {
  const response = await api.put<Task>(`${TASKS_PATH}/${id}`,data )
  return response.data; 
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const response = await api.patch<Task>(`${TASKS_PATH}/${id}/status`,{status: status})
  return response.data; 
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`${TASKS_PATH}/${id}`)
  
}
