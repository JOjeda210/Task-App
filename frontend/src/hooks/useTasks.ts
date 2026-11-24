import { useState, useEffect, useCallback, useRef } from 'react'
import type { Task, TaskStatus } from '../types/task'
import { getTasks } from '../services/taskService'

export const useTasks = (status?: TaskStatus) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const latestRequestId = useRef(0)

    const load = useCallback(async () => {
        const requestId = ++latestRequestId.current
        setIsLoading(true)
        setError(null)
        try {
            const data = await getTasks(status)
            if (requestId !== latestRequestId.current) return
            setTasks(data)
        } catch {
            if (requestId !== latestRequestId.current) return
            setError('No se pudieron cargar las tareas')
        } finally {
            if (requestId === latestRequestId.current) setIsLoading(false)
        }
    }, [status])

    useEffect(() => {
        load()
    }, [load])

    const replaceTask = useCallback(
        (updated: Task) => {
            setTasks((current) =>
                current.flatMap((task) => {
                    if (task.id !== updated.id) return [task]
                    // con un filtro activo, la tarea que ya no coincide sale de la lista
                    return status && updated.status !== status ? [] : [updated]
                }),
            )
        },
        [status],
    )

    const removeTask = useCallback((id: number) => {
        setTasks((current) => current.filter((task) => task.id !== id))
    }, [])

    return { tasks, isLoading, error, reload: load, replaceTask, removeTask }
}

