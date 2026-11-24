import type { TaskFormValues } from '../types/task'

export const EMPTY_TASK_FORM_VALUES: TaskFormValues = {
  title: '',
  description: '',
  responsible: '',
  due_date: '',
  priority: 'medium',
}
