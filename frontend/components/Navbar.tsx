"use client"

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function Navbar() {
    const pathname = usePathname()
    const { isAuthenticated } = useAuth()
    const { logout } = useAuth()
    const router = useRouter()


    const links = [
        { href: '/main/projects', label: 'Projects' },
    ]

    if (isAuthenticated === null) return null

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Task Manager
                </Link>

                <div className="flex space-x-4">
                    {isAuthenticated ? (
                        <>
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`hover:text-gray-300 ${pathname === link.href ? 'text-blue-300' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button onClick={() => {
                                logout()
                                router.push("/login")
                            }} className="hover:text-gray-300">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`hover:text-gray-300 ${pathname === '/login' ? 'text-blue-300' : ''}`}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className={`hover:text-gray-300 ${pathname === '/register' ? 'text-blue-300' : ''}`}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}