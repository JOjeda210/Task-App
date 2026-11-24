import { useCallback, useRef, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/tasks/ConfirmDialog'
import TaskDetail from '../components/tasks/TaskDetail'
import ToastNotifications from '../components/tasks/ToastNotifications'
import type { ToastMessage } from '../types/toast'
import { getMockTaskById } from '../utils/mockTasks'

export default function TaskDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(1)

  // TODO(user): reemplazar mock por datos reales de la API
  // TODO(user): cargar con getTaskById(Number(id)) y gestionar isLoading, error de red y 404
  const task = getMockTaskById(Number(id))

  const closeToast = useCallback((toastId: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  const handleDeleteConfirm = () => {
    // TODO(user): llamar a deleteTask(task.id), gestionar isDeleting/errores y navegar a "/" al terminar
    setIsDeleteOpen(false)
    const toastId = nextToastId.current++
    setToasts((current) => [
      ...current,
      { id: toastId, variant: 'success', message: 'Demo: aquí se eliminaría la tarea' },
    ])
  }

  if (!task) {
    return (
      <Alert variant="warning" className="d-flex flex-wrap align-items-center gap-3">
        <i className="bi bi-search fs-4" aria-hidden="true" />
        <div className="flex-grow-1">
          <strong>Tarea no encontrada.</strong>
          <div>Es posible que haya sido eliminada.</div>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate('/')}>
          Volver al listado
        </Button>
      </Alert>
    )
  }

  return (
    <>
      <TaskDetail
        task={task}
        onBack={() => navigate('/')}
        onEdit={() => navigate(`/tasks/${task.id}/edit`)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <ConfirmDialog
        show={isDeleteOpen}
        title="Eliminar tarea"
        message={`¿Seguro que quieres eliminar "${task.title}"? Esta acción no se puede deshacer.`}
        isLoading={false}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <ToastNotifications toasts={toasts} onClose={closeToast} />
    </>
  )
}
