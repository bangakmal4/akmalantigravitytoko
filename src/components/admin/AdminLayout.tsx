import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Warehouse,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'

export const AdminLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const navLinks = [
    { label: 'Ringkasan Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Kelola Produk', to: '/admin/products', icon: Package },
    { label: 'Kategori Produk', to: '/admin/categories', icon: Layers },
    { label: 'Daftar Pesanan', to: '/admin/orders', icon: ShoppingBag },
    { label: 'Data Pelanggan', to: '/admin/customers', icon: Users },
    { label: 'Voucher & Promo', to: '/admin/promotions', icon: Tag },
    { label: 'Manajemen Stok', to: '/admin/inventory', icon: Warehouse },
    { label: 'Laporan Penjualan', to: '/admin/reports', icon: BarChart3 },
    { label: 'Pengaturan Toko', to: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-ink">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy text-slate-300 border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <img src="/logo.svg" alt="Toko Akmal" className="w-8 h-8 rounded-lg" />
          <div>
            <div className="font-bold text-white text-sm">ADMIN PANEL</div>
            <div className="text-[10px] text-slate-400">Toko Akmal Accessories</div>
          </div>
        </div>

        {/* Demo Mode Notice if supabase is not yet configured */}
        {!isSupabaseConfigured() && (
          <div className="mx-4 my-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Mode Standalone Lokal (Siap disambungkan ke Supabase)</span>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{profile?.full_name || user?.email || 'Admin'}</p>
              <p className="text-[10px] text-brand-orange uppercase font-bold tracking-wider">{profile?.role || 'Administrator'}</p>
            </div>
            <Link
              to="/"
              target="_blank"
              title="Buka Website Publik"
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-navy text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Toko Akmal" className="w-7 h-7" />
          <span className="font-bold text-sm">ADMIN PANEL</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy border-b border-slate-800 p-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-brand-blue text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <Link to="/" target="_blank" className="text-xs text-brand-orange flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Toko Publik
            </Link>
            <button onClick={handleSignOut} className="text-xs text-rose-400 font-medium">
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
