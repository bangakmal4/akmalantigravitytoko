import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setErrorMsg(error.message)
      } else {
        navigate('/admin')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk ke admin')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail('admin@tokoakmal.com')
    setPassword('Admin123!')
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Toko Akmal" className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Portal Admin Toko</h1>
          <p className="text-xs text-slate-400 mt-1">Toko Akmal Accessories HP &amp; Laptop</p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mb-6 p-3 rounded-lg bg-brand-blue/10 border border-brand-blue/30 text-slate-300 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-brand-blue flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Akun Demo Tersedia
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] underline text-brand-orange hover:text-white"
              >
                Gunakan Demo
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Email: <code className="text-white">admin@tokoakmal.com</code> | Pass: <code className="text-white">Admin123!</code>
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Staf/Admin</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@tokoakmal.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? 'Memproses Otentikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
          <a href="/" className="text-xs text-slate-400 hover:text-white transition">
            &larr; Kembali ke Halaman Toko Publik
          </a>
        </div>
      </div>
    </div>
  )
}
