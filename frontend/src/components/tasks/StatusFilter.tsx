import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import type { TaskStatus } from '../../types/task'
import { STATUS_ORDER, STATUS_STYLES } from '../../utils/taskPresentation'

interface StatusFilterProps {
  value: TaskStatus | null
  onChange: (value: TaskStatus | null) => void
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <ButtonGroup role="group" aria-label="Filtrar tareas por estado" className="flex-wrap">
      <Button
        variant={value === null ? 'dark' : 'outline-dark'}
        aria-pressed={value === null}
        onClick={() => onChange(null)}
      >
        Todas
      </Button>
      {STATUS_ORDER.map((status) => (
        <Button
          key={status}
          variant={value === status ? 'dark' : 'outline-dark'}
          aria-pressed={value === status}
          onClick={() => onChange(status)}
        >
          <i className={`bi ${STATUS_STYLES[status].icon} me-1`} aria-hidden="true" />
          {STATUS_STYLES[status].label}
        </Button>
      ))}
    </ButtonGroup>
  )
}
