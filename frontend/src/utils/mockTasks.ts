import type { Task, TaskFormValues } from '../types/task'

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Diseñar el esquema de la base de datos',
    description: 'Definir tablas, índices y migraciones iniciales con Alembic.',
    responsible: 'Ana Torres',
    due_date: '2026-12-05',
    priority: 'high',
    status: 'in_progress',
    created_at: '2026-11-20T09:30:00Z',
    updated_at: '2026-11-22T16:45:00Z',
  },
  {
    id: 2,
    title: 'Redactar la documentación de la API',
    description: null,
    responsible: 'Luis Gómez',
    due_date: '2026-12-12',
    priority: 'medium',
    status: 'pending',
    created_at: '2026-11-21T11:00:00Z',
    updated_at: '2026-11-21T11:00:00Z',
  },
  {
    id: 3,
    title: 'Configurar el despliegue con Docker Compose',
    description: 'Contenedores para base de datos, backend y frontend.',
    responsible: 'María Pérez',
    due_date: '2026-11-30',
    priority: 'low',
    status: 'completed',
    created_at: '2026-11-18T08:15:00Z',
    updated_at: '2026-11-23T10:00:00Z',
  },
  {
    id: 4,
    title:
      'Revisar el rendimiento de las consultas del listado de tareas cuando hay muchos registros y filtros combinados',
    description: 'Analizar los planes de ejecución y añadir índices si hace falta.',
    responsible: 'Carlos Ruiz',
    due_date: '2026-12-20',
    priority: 'high',
    status: 'pending',
    created_at: '2026-11-22T14:20:00Z',
    updated_at: '2026-11-22T14:20:00Z',
  },
]

export function getMockTaskById(id: number): Task | undefined {
  return MOCK_TASKS.find((task) => task.id === id)
}

export function getMockFormValues(id: number): TaskFormValues | undefined {
  const task = getMockTaskById(id)
  if (!task) return undefined
  return {
    title: task.title,
    description: task.description ?? '',
    responsible: task.responsible,
    due_date: task.due_date,
    priority: task.priority,
  }
}
