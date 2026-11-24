import { useState, useEffect, useCallback } from 'react'
import type { Task, TaskStatus } from '../types/task'
import { getTasks } from '../services/taskService'

export const useTasks = (status?: TaskStatus) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getTasks(status)
            setTasks(data)
        } catch {
            setError('No se pudieron cargar las tareas')
        } finally {
            setIsLoading(false)
        }
    }, [status])

    useEffect(() => {
        load()
    }, [load])

    return { tasks, isLoading, error, reload: load }
}

