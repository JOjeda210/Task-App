import { useCallback, useRef, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { useNavigate, useParams } from 'react-router-dom'
import TaskForm from '../components/tasks/TaskForm'
import ToastNotifications from '../components/tasks/ToastNotifications'
import type { TaskFormErrors, TaskFormValues } from '../types/task'
import type { ToastMessage } from '../types/toast'
import { getMockFormValues } from '../utils/mockTasks'
import { EMPTY_TASK_FORM_VALUES } from '../utils/taskFormDefaults'

export default function TaskFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = id !== undefined

  // TODO(user): reemplazar mock por datos reales de la API
  // TODO(user): en edición, cargar con getTaskById(Number(id)) y mapear Task -> TaskFormValues
  const [values, setValues] = useState<TaskFormValues>(
    () => (isEditing ? getMockFormValues(Number(id)) : undefined) ?? EMPTY_TASK_FORM_VALUES,
  )
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(1)

  // TODO(user): calcular los errores de validación (título 1-150, responsable 1-100, fecha, prioridad) y guardarlos en estado
  const errors: TaskFormErrors = {}
  // TODO(user): gestionar isSubmitting mientras dura la petición
  const isSubmitting = false

  const closeToast = useCallback((toastId: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  const handleChange = (field: keyof TaskFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = () => {
    // TODO(user): validar values; mapear TaskFormValues -> TaskCreate/TaskUpdate
    // TODO(user): crear con createTask(data) o editar con updateTask(Number(id), data), mostrar errores del backend (422) y navegar al terminar
    const toastId = nextToastId.current++
    setToasts((current) => [
      ...current,
      { id: toastId, variant: 'success', message: 'Demo: aquí se guardaría la tarea' },
    ])
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
