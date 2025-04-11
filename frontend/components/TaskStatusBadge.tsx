import { TaskStatus } from "@/api/api"

const statusColors = {
    TODO: 'bg-gray-200 text-gray-800',
    IN_PROGRESS: 'bg-yellow-200 text-yellow-800',
    DONE: 'bg-green-200 text-green-800',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
        >
            {status.replace('_', ' ')}
        </span>
    )
}