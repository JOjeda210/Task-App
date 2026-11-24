import { memo } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import type { Task, TaskStatus } from '../../types/task'
import { STATUS_ORDER, STATUS_STYLES, formatDate } from '../../utils/taskPresentation'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'

interface TaskItemProps {
  task: Task
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: TaskStatus) => void
}

// memo: con muchas tareas, abrir un modal o cambiar el filtro no debe repintar las filas sin cambios
function TaskItem({ task, onView, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  return (
    <Card as="article" className="task-item shadow-sm">
      <Card.Body className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
        <div className="flex-grow-1 min-w-0">
          <h2 className="h5 mb-2 task-item-title">{task.title}</h2>
          <div className="d-flex flex-wrap gap-3 text-body-secondary small mb-2">
            <span>
              <i className="bi bi-person me-1" aria-hidden="true" />
              <span className="visually-hidden">Responsable: </span>
              {task.responsible}
            </span>
            <span>
              <i className="bi bi-calendar-event me-1" aria-hidden="true" />
              <span className="visually-hidden">Fecha límite: </span>
              {formatDate(task.due_date)}
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>

        <div className="d-flex gap-2 flex-shrink-0">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              aria-label={`Cambiar estado de ${task.title}`}
            >
              <i className="bi bi-arrow-left-right" aria-hidden="true" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {STATUS_ORDER.map((status) => (
                <Dropdown.Item
                  key={status}
                  active={status === task.status}
                  onClick={() => onStatusChange(task.id, status)}
                >
                  <i className={`bi ${STATUS_STYLES[status].icon} me-2`} aria-hidden="true" />
                  {STATUS_STYLES[status].label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="outline-primary"
            size="sm"
            aria-label={`Ver ${task.title}`}
            onClick={() => onView(task.id)}
          >
            <i className="bi bi-eye" aria-hidden="true" />
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            aria-label={`Editar ${task.title}`}
            onClick={() => onEdit(task.id)}
          >
            <i className="bi bi-pencil" aria-hidden="true" />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            aria-label={`Eliminar ${task.title}`}
            onClick={() => onDelete(task.id)}
          >
            <i className="bi bi-trash" aria-hidden="true" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default memo(TaskItem)
