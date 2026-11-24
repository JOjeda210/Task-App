import type { Task, TaskCreate, TaskStatus, TaskUpdate } from '../types/task'

export async function getTasks(status?: TaskStatus): Promise<Task[]> {
  // TODO(user): implementar con Axios
  void status
  throw new Error('Not implemented')
}

export async function getTaskById(id: number): Promise<Task> {
  // TODO(user): implementar con Axios
  void id
  throw new Error('Not implemented')
}

export async function createTask(data: TaskCreate): Promise<Task> {
  // TODO(user): implementar con Axios
  void data
  throw new Error('Not implemented')
}

export async function updateTask(id: number, data: TaskUpdate): Promise<Task> {
  // TODO(user): implementar con Axios
  void id
  void data
  throw new Error('Not implemented')
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  // TODO(user): implementar con Axios
  void id
  void status
  throw new Error('Not implemented')
}

export async function deleteTask(id: number): Promise<void> {
  // TODO(user): implementar con Axios
  void id
  throw new Error('Not implemented')
}
