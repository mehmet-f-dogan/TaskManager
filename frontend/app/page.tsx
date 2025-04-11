import Link from 'next/link'

export default function Home() {
    return (
        <div className="text-center py-10">
            <h1 className="text-3xl font-bold mb-6">Welcome to Task Manager</h1>
            <p className="mb-8 text-gray-600">
                Manage your projects and tasks efficiently in one place.
            </p>
        </div>
    )
}