import { memo } from 'react'
import Badge from 'react-bootstrap/Badge'
import type { TaskStatus } from '../../types/task'
import { STATUS_STYLES } from '../../utils/taskPresentation'

interface StatusBadgeProps {
  status: TaskStatus
}

// memo: se pinta una vez por tarea y solo cambia si cambia su estado
function StatusBadge({ status }: StatusBadgeProps) {
  const { label, variant, icon } = STATUS_STYLES[status]
  return (
    <Badge bg={variant} className="d-inline-flex align-items-center gap-1">
      <i className={`bi ${icon}`} aria-hidden="true" />
      {label}
    </Badge>
  )
}

export default memo(StatusBadge)
