'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { token } = useAuth()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    useEffect(() => {
        if (!token) {
            router.push('/login')
        } else {
            setIsCheckingAuth(false)
        }
    }, [token, router])

    if (!token || isCheckingAuth) {
        return <></>
    }

    return <>{children}</>
}