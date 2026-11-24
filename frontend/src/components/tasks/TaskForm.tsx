import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import type { TaskFormErrors, TaskFormValues } from '../../types/task'
import { PRIORITY_ORDER, PRIORITY_STYLES } from '../../utils/taskPresentation'

const TITLE_MAX_LENGTH = 150
const RESPONSIBLE_MAX_LENGTH = 100

interface TaskFormProps {
  values: TaskFormValues
  errors: TaskFormErrors
  isSubmitting: boolean
  submitLabel: string
  onChange: (field: keyof TaskFormValues, value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function TaskForm({
  values,
  errors,
  isSubmitting,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  return (
    <Form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Form.Group className="mb-3" controlId="task-title">
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          value={values.title}
          maxLength={TITLE_MAX_LENGTH}
          isInvalid={Boolean(errors.title)}
          aria-describedby="task-title-counter"
          onChange={(event) => onChange('title', event.target.value)}
        />
        <div className="d-flex justify-content-between">
          <Form.Control.Feedback type="invalid" aria-live="polite">
            {errors.title}
          </Form.Control.Feedback>
          <Form.Text id="task-title-counter" className="ms-auto">
            {values.title.length}/{TITLE_MAX_LENGTH}
          </Form.Text>
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="task-description">
        <Form.Label>
          Descripción <span className="text-body-secondary">(opcional)</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={values.description}
          isInvalid={Boolean(errors.description)}
          onChange={(event) => onChange('description', event.target.value)}
        />
        <Form.Control.Feedback type="invalid" aria-live="polite">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="row">
        <Form.Group className="col-md-6 mb-3" controlId="task-responsible">
          <Form.Label>Responsable</Form.Label>
          <Form.Control
            type="text"
            value={values.responsible}
            maxLength={RESPONSIBLE_MAX_LENGTH}
            isInvalid={Boolean(errors.responsible)}
            onChange={(event) => onChange('responsible', event.target.value)}
          />
          <Form.Control.Feedback type="invalid" aria-live="polite">
            {errors.responsible}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-md-6 mb-3" controlId="task-due-date">
          <Form.Label>Fecha límite</Form.Label>
          <Form.Control
            type="date"
            value={values.due_date}
            isInvalid={Boolean(errors.due_date)}
            onChange={(event) => onChange('due_date', event.target.value)}
          />
          <Form.Control.Feedback type="invalid" aria-live="polite">
            {errors.due_date}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <Form.Group className="mb-4" controlId="task-priority">
        <Form.Label>Prioridad</Form.Label>
        <Form.Select
          value={values.priority}
          isInvalid={Boolean(errors.priority)}
          onChange={(event) => onChange('priority', event.target.value)}
        >
          {PRIORITY_ORDER.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_STYLES[priority].label}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid" aria-live="polite">
          {errors.priority}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2">
        <Button variant="outline-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" aria-hidden="true" />
              Guardando…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </Form>
  )
}
