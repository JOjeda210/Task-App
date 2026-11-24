import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/tasks/ConfirmDialog'
import StatusFilter from '../components/tasks/StatusFilter'
import TaskList from '../components/tasks/TaskList'
import ToastNotifications from '../components/tasks/ToastNotifications'
import { useTasks } from '../hooks/useTasks'
import { updateTaskStatus } from '../services/taskService'
import type { TaskStatus } from '../types/task'
import type { ToastMessage } from '../types/toast'

export default function TasksPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(1)

  const { tasks, isLoading, error, reload, replaceTask } = useTasks(statusFilter ?? undefined)

  const taskToDelete = taskIdToDelete === null ? undefined : tasks.find((task) => task.id === taskIdToDelete)

  const showToast = useCallback((variant: ToastMessage['variant'], message: string) => {
    const id = nextToastId.current++
    setToasts((current) => [...current, { id, variant, message }])
  }, [])

  const closeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const handleRetry = useCallback(() => {
    reload()
  }, [reload])

  const handleCreate = useCallback(() => navigate('/tasks/new'), [navigate])
  const handleView = useCallback((id: number) => navigate(`/tasks/${id}`), [navigate])
  const handleEdit = useCallback((id: number) => navigate(`/tasks/${id}/edit`), [navigate])
  const handleDeleteRequest = useCallback((id: number) => setTaskIdToDelete(id), [])

  const handleStatusChange = useCallback(
    async (id: number, status: TaskStatus) => {
      try {
        replaceTask(await updateTaskStatus(id, status))
        showToast('success', 'Estado actualizado')
      } catch {
        showToast('danger', 'No se pudo actualizar el estado')
      }
    },
    [replaceTask, showToast],
  )

  const handleDeleteConfirm = useCallback(() => {
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