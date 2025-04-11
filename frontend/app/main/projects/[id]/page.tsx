'use client'

import { getProjectById, getTasksByProjectId } from '@/api/api'
import { TaskCard } from '@/components/TaskCard'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'

export default function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { token } = useAuth()
    const router = useRouter()
    const [project, setProject] = useState<any>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const { id } = use(params)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await getProjectById(token!, Number(id))
                if (!projectData) {
                    notFound()
                }
                setProject(projectData)

                const tasksData = await getTasksByProjectId(token!, Number(id))
                setTasks(tasksData || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token, id, router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!project) {
        return notFound()
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="flex space-x-3 mt-4">
                    <Link
                        href={`/main/projects/${id}/edit`}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    >
                        Edit
                    </Link>
                    <Link
                        href={`/main/tasks/create?projectId=${id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Add Task
                    </Link>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            {tasks && tasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No tasks found for this project.</p>
            )}
        </div>
    )
}