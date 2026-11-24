import { useCallback, useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import TaskForm from '../components/tasks/TaskForm'
import ToastNotifications from '../components/tasks/ToastNotifications'
import { createTask, getTaskById, updateTask } from '../services/taskService'
import type {
  Task,
  TaskCreate,
  TaskFormErrors,
  TaskFormValues,
  TaskPriority,
} from '../types/task'
import type { ToastMessage } from '../types/toast'
import { EMPTY_TASK_FORM_VALUES } from '../utils/taskFormDefaults'

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

const taskToFormValues = (task: Task): TaskFormValues => ({
  title: task.title,
  description: task.description ?? '',
  responsible: task.responsible,
  due_date: task.due_date,
  priority: task.priority,
})

// Reglas espejo de los schemas del backend (título 1-150, responsable 1-100)
const validate = (values: TaskFormValues): TaskFormErrors => {
  const errors: TaskFormErrors = {}
  const title = values.title.trim()
  const responsible = values.responsible.trim()

  if (title.length < 1) errors.title = 'El título es obligatorio'
  else if (title.length > 150) errors.title = 'El título no puede superar los 150 caracteres'

  if (responsible.length < 1) errors.responsible = 'El responsable es obligatorio'
  else if (responsible.length > 100) errors.responsible = 'El responsable no puede superar los 100 caracteres'

  if (!values.due_date) errors.due_date = 'La fecha límite es obligatoria'

  if (!PRIORITIES.includes(values.priority as TaskPriority)) errors.priority = 'Selecciona una prioridad'

  return errors
}


const formValuesToPayload = (values: TaskFormValues): TaskCreate => ({
  title: values.title.trim(),
  description: values.description.trim() || null,
  responsible: values.responsible.trim(),
  due_date: values.due_date,
  priority: values.priority as TaskPriority,
})


const extractBackendErrors = (err: unknown): TaskFormErrors | null => {
  if (!isAxiosError(err) || err.response?.status !== 422) return null
  const detail: unknown = err.response.data?.detail
  if (!Array.isArray(detail)) return null

  const fields = Object.keys(EMPTY_TASK_FORM_VALUES) as (keyof TaskFormValues)[]
  const errors: TaskFormErrors = {}
  for (const issue of detail) {
    const field = issue?.loc?.[issue.loc.length - 1]
    if (fields.includes(field) && typeof issue.msg === 'string') {
      errors[field as keyof TaskFormValues] = issue.msg
    }
  }
  return errors
}

export default function TaskFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = id !== undefined

  const [values, setValues] = useState<TaskFormValues>(EMPTY_TASK_FORM_VALUES)
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const [isLoadingTask, setIsLoadingTask] = useState(isEditing)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(1)

  const showToast = useCallback((variant: ToastMessage['variant'], message: string) => {
    const toastId = nextToastId.current++
    setToasts((current) => [...current, { id: toastId, variant, message }])
  }, [])

  const closeToast = useCallback((toastId: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  // En edición: cargar la tarea y rellenar el formulario
  useEffect(() => {
    if (!isEditing) return

    const loadTask = async () => {
      setIsLoadingTask(true)
      setLoadError(null)
      try {
        const task = await getTaskById(Number(id))
        setValues(taskToFormValues(task))
      } catch (err) {
        setLoadError(
          isAxiosError(err) && err.response?.status === 404
            ? 'La tarea no existe.'
            : 'No se pudo cargar la tarea.',
        )
      } finally {
        setIsLoadingTask(false)
      }
    }

    loadTask()
  }, [id, isEditing])

  const handleChange = (field: keyof TaskFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    // al editar un campo, se limpia su error
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async () => {
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const payload = formValuesToPayload(values)
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await updateTask(Number(id), payload)
        navigate(`/tasks/${id}`)
      } else {
        await createTask(payload)
        navigate('/')
      }
    } catch (err) {
      const backendErrors = extractBackendErrors(err)
      if (backendErrors) {
        setErrors(backendErrors)
        showToast('danger', 'Revisa los campos marcados')
      } else {
        showToast('danger', 'No se pudo guardar la tarea')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEditing && isLoadingTask) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando tarea...</span>
        </Spinner>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto form-page-width">
        <Alert variant="danger">{loadError}</Alert>
        <Button variant="outline-secondary" onClick={() => navigate('/')}>
          Volver a la lista
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto form-page-width">
        <h1 className="h3 mb-4">{isEditing ? 'Editar tarea' : 'Nueva tarea'}</h1>
        <Card className="shadow-sm fade-in">
          <Card.Body className="p-4">
            <TaskForm
              values={values}
              errors={errors}
              isSubmitting={isSubmitting}
              submitLabel={isEditing ? 'Guardar cambios' : 'Crear tarea'}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={() => navigate(isEditing ? `/tasks/${id}` : '/')}
            />
          </Card.Body>
        </Card>
      </div>

      <ToastNotifications toasts={toasts} onClose={closeToast} />
    </>
  )
}