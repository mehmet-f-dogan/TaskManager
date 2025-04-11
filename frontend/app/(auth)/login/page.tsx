"use client"

import { AuthForm } from '@/components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const { token } = useAuth()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    useEffect(() => {
        if (token) {
            router.push('/main/projects')
        } else {
            setIsCheckingAuth(false)
        }
    }, [token, router])

    if (token || isCheckingAuth) {
        return <></>
    }

    return <AuthForm type="login" />
}