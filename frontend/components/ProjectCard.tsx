import { ProjectResponse } from '@/api/api'
import Link from 'next/link'

export function ProjectCard({ project }: { project: ProjectResponse }) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <Link
                    href={`/main/projects/${project.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}