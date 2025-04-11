"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthResponse, login as loginFunc, register as registerFunc } from '@/api/api'
import { useAuth } from '@/contexts/AuthContext'

type AuthFormProps = {
    type: 'login' | 'register'
}

export function AuthForm({ type }: AuthFormProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            let result: AuthResponse | null = null
            if (type == 'login') {
                result = await loginFunc({
                    username, password
                })
            } else {
                result = await registerFunc({
                    username, password
                })
            }

            if (result) {
                login(result.token)
                router.push('/main/projects')
            } else {
                setError('Invalid credentials')
            }
        } catch (err) {
            console.log(err)
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
                {type === 'login' ? 'Login' : 'Register'}
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {type === 'login' ? 'Login' : 'Register'}
                </button>
            </form>
            <div className="mt-4 text-center">
                {type === 'login' ? (
                    <p>
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:text-blue-800">
                            Register
                        </a>
                    </p>
                ) : (
                    <p>
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:text-blue-800">
                            Login
                        </a>
                    </p>
                )}
            </div>
        </div>
    )
}