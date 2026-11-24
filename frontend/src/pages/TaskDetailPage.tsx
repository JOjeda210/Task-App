import { useCallback, useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/tasks/ConfirmDialog'
import TaskDetail from '../components/tasks/TaskDetail'
import ToastNotifications from '../components/tasks/ToastNotifications'
import { deleteTask, getTaskById } from '../services/taskService'
import type { Task } from '../types/task'
import type { ToastMessage } from '../types/toast'

export default function TaskDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(1)

  const showToast = useCallback((variant: ToastMessage['variant'], message: string) => {
    const toastId = nextToastId.current++
    setToasts((current) => [...current, { id: toastId, variant, message }])
  }, [])

  const closeToast = useCallback((toastId: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  const loadTask = useCallback(async () => {
    setIsLoading(true)
    setNotFound(false)
    setError(null)
    try {
      setTask(await getTaskById(Number(id)))
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        setNotFound(true)
      } else {
        setError('No se pudo cargar la tarea.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadTask()
  }, [loadTask])

  const handleDeleteConfirm = async () => {
    if (!task) return
    setIsDeleting(true)
    try {
      await deleteTask(task.id)
      navigate('/')
    } catch {
      setIsDeleteOpen(false)
      showToast('danger', 'No se pudo eliminar la tarea')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando tarea...</span>
        </Spinner>
      </div>
    )
  }

  if (notFound) {
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

  if (error || !task) {
    return (
      <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-3">
        <div className="flex-grow-1">
          <strong>{error ?? 'No se pudo cargar la tarea.'}</strong>
        </div>
        <Button variant="outline-danger" onClick={loadTask}>
          Reintentar
        </Button>
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
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <ToastNotifications toasts={toasts} onClose={closeToast} />
    </>
  )
}