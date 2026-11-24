import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/tasks/ConfirmDialog'
import StatusFilter from '../components/tasks/StatusFilter'
import TaskList from '../components/tasks/TaskList'
import ToastNotifications from '../components/tasks/ToastNotifications'
import type { TaskStatus } from '../types/task'
import type { ToastMessage } from '../types/toast'
import { MOCK_TASKS } from '../utils/mockTasks'

export default function TasksPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(1)

  // TODO(user): reemplazar mock por datos reales de la API
  // TODO(user): cargar con getTasks(statusFilter ?? undefined) cuando cambie el filtro y guardar tasks/isLoading/error en estado (idealmente en un hook de src/hooks)
  const tasks = useMemo(
    () => (statusFilter ? MOCK_TASKS.filter((task) => task.status === statusFilter) : MOCK_TASKS),
    [statusFilter],
  )
  const isLoading = false
  const error: string | null = null

  const taskToDelete = taskIdToDelete === null ? undefined : MOCK_TASKS.find((task) => task.id === taskIdToDelete)

  const showToast = useCallback((variant: ToastMessage['variant'], message: string) => {
    const id = nextToastId.current++
    setToasts((current) => [...current, { id, variant, message }])
  }, [])

  const closeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  // useCallback: TaskList/TaskItem están memoizados y necesitan callbacks con identidad estable
  const handleRetry = useCallback(() => {
    // TODO(user): volver a llamar a getTasks(statusFilter ?? undefined) y gestionar isLoading/error
  }, [])

  const handleCreate = useCallback(() => navigate('/tasks/new'), [navigate])
  const handleView = useCallback((id: number) => navigate(`/tasks/${id}`), [navigate])
  const handleEdit = useCallback((id: number) => navigate(`/tasks/${id}/edit`), [navigate])
  const handleDeleteRequest = useCallback((id: number) => setTaskIdToDelete(id), [])

  const handleStatusChange = useCallback(
    (id: number, status: TaskStatus) => {
      // TODO(user): llamar a updateTaskStatus(id, status), actualizar la lista con la tarea devuelta y mostrar el error si falla
      void id
      void status
      showToast('success', 'Demo: aquí se cambiaría el estado de la tarea')
    },
    [showToast],
  )

  const handleDeleteConfirm = useCallback(() => {
    // TODO(user): llamar a deleteTask(taskIdToDelete), quitar la tarea de la lista, gestionar isDeleting y errores
    setTaskIdToDelete(null)
    showToast('success', 'Demo: aquí se eliminaría la tarea')
  }, [showToast])

  const handleDeleteCancel = useCallback(() => setTaskIdToDelete(null), [])

  return (
    <>
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <h1 className="h3 mb-0">Mis tareas</h1>
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
        onCreate={handleCreate}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onStatusChange={handleStatusChange}
      />

      <ConfirmDialog
        show={taskIdToDelete !== null}
        title="Eliminar tarea"
        message={`¿Seguro que quieres eliminar "${taskToDelete?.title ?? ''}"? Esta acción no se puede deshacer.`}
        isLoading={false}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <ToastNotifications toasts={toasts} onClose={closeToast} />
    </>
  )
}
