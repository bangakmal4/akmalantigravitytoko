import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile } from '@/types/database.types'

interface AuthContextType {
  user: any | null
  profile: Profile | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If Supabase not yet hooked with real cloud keys, support demo admin mode
    if (!isSupabaseConfigured()) {
      const savedUser = localStorage.getItem('tok_admin_demo_user')
      if (savedUser) {
        setUser({ email: 'admin@tokoakmal.com', id: 'demo-admin-id' })
        setProfile({
          id: 'demo-admin-id',
          email: 'admin@tokoakmal.com',
          full_name: 'Akmal Admin',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      setIsLoading(false)
      return
    }

    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        setUser(data.session.user)
        await fetchProfile(data.session.user.id)
      }
      setIsLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data as Profile)
      }
    } catch (e) {
      console.error('Error fetching profile', e)
    }
  }

  const signIn = async (email: string, pass: string) => {
    if (!isSupabaseConfigured()) {
      // Demo admin credential check
      if (email.toLowerCase() === 'admin@tokoakmal.com' && pass === 'Admin123!') {
        const demoUser = { email, id: 'demo-admin-id' }
        localStorage.setItem('tok_admin_demo_user', JSON.stringify(demoUser))
        setUser(demoUser)
        setProfile({
          id: 'demo-admin-id',
          email,
          full_name: 'Akmal Admin',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        return { error: null }
      }
      return { error: new Error('Email atau password demo salah. Gunakan admin@tokoakmal.com / Admin123!') }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem('tok_admin_demo_user')
      setUser(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'staff'

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
