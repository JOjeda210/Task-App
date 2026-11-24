import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import type { Task } from '../../types/task'
import { formatDate, formatDateTime } from '../../utils/taskPresentation'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'

interface TaskDetailProps {
  task: Task
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function TaskDetail({ task, onBack, onEdit, onDelete }: TaskDetailProps) {
  return (
    <Card className="shadow-sm fade-in">
      <Card.Body className="p-4">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
        <h1 className="h3 mb-4 task-item-title">{task.title}</h1>

        <dl className="row mb-4">
          <dt className="col-sm-3">Descripción</dt>
          <dd className="col-sm-9 task-description">
            {task.description ?? <span className="text-body-secondary">Sin descripción</span>}
          </dd>
          <dt className="col-sm-3">Responsable</dt>
          <dd className="col-sm-9">{task.responsible}</dd>
          <dt className="col-sm-3">Fecha límite</dt>
          <dd className="col-sm-9">{formatDate(task.due_date)}</dd>
          <dt className="col-sm-3">Creada</dt>
          <dd className="col-sm-9">{formatDateTime(task.created_at)}</dd>
          <dt className="col-sm-3">Actualizada</dt>
          <dd className="col-sm-9">{formatDateTime(task.updated_at)}</dd>
        </dl>

        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button variant="outline-secondary" onClick={onBack}>
            <i className="bi bi-arrow-left me-1" aria-hidden="true" />
            Volver
          </Button>
          <div className="d-flex flex-column flex-sm-row gap-2 ms-sm-auto">
            <Button variant="primary" onClick={onEdit}>
              <i className="bi bi-pencil me-1" aria-hidden="true" />
              Editar
            </Button>
            <Button variant="outline-danger" onClick={onDelete}>
              <i className="bi bi-trash me-1" aria-hidden="true" />
              Eliminar
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
