'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
}

type SignInResult =
  | { user: User; error?: never }
  | { error: string; user?: never };

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  role: string | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
} | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Restore session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user || null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { error: data.error || 'Invalid email or password' }
      }
      const loggedInUser: User = data.user
      setUser(loggedInUser)
      return { user: loggedInUser }
    } catch {
      return { error: 'Network error — please try again' }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } finally {
      setUser(null)
      router.push('/')
    }
  }, [router])

  const role = user?.is_admin ? 'admin' : user ? 'user' : null

  return (
    <AuthContext.Provider value={{ user, loading, role, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
