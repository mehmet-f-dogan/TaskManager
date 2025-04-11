'use client'

import { getTaskById, TaskStatus, updateTaskStatus } from '@/api/api'
import { TaskStatusBadge } from '@/components/TaskStatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { token } = useAuth()
    const router = useRouter()
    const [task, setTask] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { id } = use(params)


    useEffect(() => {
        const fetchTask = async () => {
            try {
                if (!token) return
                const taskData = await getTaskById(token, Number(id))
                if (!taskData) {
                    router.replace('/not-found')
                    return
                }
                setTask(taskData)
            } catch (err) {
                setError('Failed to fetch task details')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTask()
    }, [token, id, router])

    const handleStatusChange = async (newStatus: TaskStatus) => {
        try {
            if (!token) return
            await updateTaskStatus(token, Number(id), newStatus)
            const updatedTask = await getTaskById(token, Number(id))
            setTask(updatedTask)
        } catch (err) {
            setError('Failed to update task status')
            console.error(err)
        }
    }

    if (loading) return <div className="max-w-2xl mx-auto mt-10 p-6">Loading...</div>
    if (error) return <div className="max-w-2xl mx-auto mt-10 p-6 text-red-500">{error}</div>
    if (!task) return <div className="max-w-2xl mx-auto mt-10 p-6">Task not found</div>

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <TaskStatusBadge status={task.status} />
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Project</h3>
                    <Link
                        href={`/main/projects/${task.projectId}`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        View Project
                    </Link>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                    <p>{task.assignedUserName}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p>{new Date(task.createdAt).toLocaleString()}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p>{new Date(task.updatedAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Update Status</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleStatusChange('TODO')}
                        className={`px-3 py-1 rounded-md ${task.status === 'TODO' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300 transition-colors`}
                    >
                        To Do
                    </button>
                    <button
                        onClick={() => handleStatusChange('IN_PROGRESS')}
                        className={`px-3 py-1 rounded-md ${task.status === 'IN_PROGRESS' ? 'bg-yellow-600 text-white' : 'bg-yellow-200 text-yellow-800'} hover:bg-yellow-300 transition-colors`}
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => handleStatusChange('DONE')}
                        className={`px-3 py-1 rounded-md ${task.status === 'DONE' ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800'} hover:bg-green-300 transition-colors`}
                    >
                        Done
                    </button>
                </div>
            </div>

            <div className="flex space-x-3">
                <Link
                    href={`/main/tasks/${id}/edit`}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                    Edit
                </Link>
                <Link
                    href={`/main/projects/${task.projectId}`}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Back to Project
                </Link>
            </div>
        </div>
    )
}