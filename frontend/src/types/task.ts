export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string | null
  responsible: string
  due_date: string
  priority: TaskPriority
  status: TaskStatus
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  title: string
  description?: string | null
  responsible: string
  due_date: string
  priority: TaskPriority
}

export type TaskUpdate = TaskCreate

export interface TaskFormValues {
  title: string
  description: string
  responsible: string
  due_date: string
  priority: string
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>
