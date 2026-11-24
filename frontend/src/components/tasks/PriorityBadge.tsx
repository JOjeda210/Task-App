import { memo } from 'react'
import Badge from 'react-bootstrap/Badge'
import type { TaskPriority } from '../../types/task'
import { PRIORITY_STYLES } from '../../utils/taskPresentation'

interface PriorityBadgeProps {
  priority: TaskPriority
}

// memo: se pinta una vez por tarea y solo cambia si cambia su prioridad
function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, variant, icon } = PRIORITY_STYLES[priority]
  const textClass = variant === 'warning' ? 'text-dark' : ''
  return (
    <Badge bg={variant} className={`d-inline-flex align-items-center gap-1 ${textClass}`}>
      <i className={`bi ${icon}`} aria-hidden="true" />
      Prioridad {label.toLowerCase()}
    </Badge>
  )
}

export default memo(PriorityBadge)
