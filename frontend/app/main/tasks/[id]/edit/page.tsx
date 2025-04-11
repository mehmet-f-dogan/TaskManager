"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getTaskById, updateTask } from '@/api/api'
import { useAuth } from '@/contexts/AuthContext'

export default function EditTaskPage() {
    const params = useParams()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [projectId, setProjectId] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const task = await getTaskById(token!, Number(params.id))
                if (task) {
                    setTitle(task.title)
                    setDescription(task.description)
                    setProjectId(String(task.projectId))
                }

            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [params.id, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            if (!token) {
                router.push('/login')
                return
            }

            const response = await updateTask(token, Number(params.id), {
                title,
                description,
                projectId: Number(projectId),
            })

            if (response) {
                router.push(`/main/tasks/${params.id}`)
            } else {
                setError('Failed to update task')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }
    }

    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Task Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push(`/main/tasks/${params.id}`)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}