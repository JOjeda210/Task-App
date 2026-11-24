import type { TaskPriority, TaskStatus } from '../types/task'

export interface BadgeStyle {
  label: string
  variant: string
  icon: string
}

export const PRIORITY_STYLES: Record<TaskPriority, BadgeStyle> = {
  low: { label: 'Baja', variant: 'success', icon: 'bi-arrow-down-circle' },
  medium: { label: 'Media', variant: 'warning', icon: 'bi-dash-circle' },
  high: { label: 'Alta', variant: 'danger', icon: 'bi-arrow-up-circle' },
}

export const STATUS_STYLES: Record<TaskStatus, BadgeStyle> = {
  pending: { label: 'Pendiente', variant: 'secondary', icon: 'bi-clock' },
  in_progress: { label: 'En progreso', variant: 'primary', icon: 'bi-arrow-repeat' },
  completed: { label: 'Completada', variant: 'success', icon: 'bi-check-circle' },
}

export const STATUS_ORDER: readonly TaskStatus[] = ['pending', 'in_progress', 'completed']

export const PRIORITY_ORDER: readonly TaskPriority[] = ['low', 'medium', 'high']

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function formatDateTime(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
