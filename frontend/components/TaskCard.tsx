import Link from 'next/link'
import { TaskResponse } from '@/api/api'
import { TaskStatusBadge } from './TaskStatusBadge'

export function TaskCard({ task }: { task: TaskResponse }) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <TaskStatusBadge status={task.status} />
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Assigned to: {task.assignedUserName}
                </span>
                <Link
                    href={`/main/tasks/${task.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}