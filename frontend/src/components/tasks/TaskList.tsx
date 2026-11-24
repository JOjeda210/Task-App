import { memo } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Placeholder from 'react-bootstrap/Placeholder'
import type { Task, TaskStatus } from '../../types/task'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onCreate: () => void
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: TaskStatus) => void
}

const SKELETON_KEYS = [1, 2, 3] as const

// memo: evita repintar la lista cuando la página cambia estado que no le afecta (modal, toasts)
function TaskList({
  tasks,
  isLoading,
  error,
  onRetry,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="d-flex flex-column gap-3" role="status" aria-busy="true">
        <span className="visually-hidden">Cargando tareas…</span>
        {SKELETON_KEYS.map((key) => (
          <Card key={key} className="shadow-sm" aria-hidden="true">
            <Card.Body>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={7} className="mb-2" />
                <Placeholder xs={4} className="d-block mb-2" />
                <Placeholder xs={2} className="me-2" />
                <Placeholder xs={2} />
              </Placeholder>
            </Card.Body>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-3 fade-in">
        <i className="bi bi-exclamation-triangle-fill fs-4" aria-hidden="true" />
        <div className="flex-grow-1">
          <strong>No se pudieron cargar las tareas.</strong>
          <div>{error}</div>
        </div>
        <Button variant="outline-danger" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
          Reintentar
        </Button>
      </Alert>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-5 fade-in">
        <i className="bi bi-clipboard-check display-1 text-body-tertiary" aria-hidden="true" />
        <h2 className="h4 mt-3">No hay tareas todavía</h2>
        <p className="text-body-secondary">Crea tu primera tarea para empezar a organizarte.</p>
        <Button variant="primary" onClick={onCreate}>
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Crear la primera tarea
        </Button>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-3 fade-in">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}

export default memo(TaskList)
