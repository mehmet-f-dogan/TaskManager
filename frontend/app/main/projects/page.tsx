"use client"

import { getAllProjects, ProjectResponse } from '@/api/api'
import { ProjectCard } from '@/components/ProjectCard'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProjectsPage() {
    const { token } = useAuth()

    const [projects, setProjects] = useState<ProjectResponse[]>([])

    useEffect(() => {
        async function loadProjects() {
            const projectData = await getAllProjects(token!)
            if (projectData) {
                setProjects(projectData)
            }
        }
        loadProjects()
    }, [])


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Link
                    href="/main/projects/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Create Project
                </Link>
            </div>

            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No projects found. Create your first project!</p>
            )}
        </div>
    )
}