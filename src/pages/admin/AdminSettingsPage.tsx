import React, { useEffect, useState } from 'react'
import { Save, Check } from 'lucide-react'
import { StoreService } from '@/services/api'
import type { StoreSettings } from '@/types/database.types'

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const init = async () => {
      const s = await StoreService.getSettings()
      setSettings(s)
      setLoading(false)
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setLoading(true)
    await StoreService.updateSettings(settings)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!settings) {
    return <div className="p-8 text-xs text-slate-500">Memuat konfigurasi toko...</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Pengaturan Toko Akmal</h1>
        <p className="text-xs text-ink-muted mt-1">
          Atur jam operasional, kontak CS, instruksi pickup toko, dan rekening pembayaran.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> Pengaturan toko berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4 text-xs">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Nama Toko</label>
          <input
            type="text"
            required
            value={settings.store_name}
            onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
            className="w-full bg-slate-50 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Tagline</label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full bg-slate-50 border rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nomor WhatsApp CS</label>
            <input
              type="text"
              required
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full bg-slate-50 border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Toko</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-slate-50 border rounded-lg p-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Alamat Fisik Toko</label>
          <textarea
            rows={2}
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-slate-50 border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Jam Operasional</label>
          <input
            type="text"
            value={settings.opening_hours}
            onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
            className="w-full bg-slate-50 border rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nama Bank</label>
            <input
              type="text"
              value={settings.bank_name}
              onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
              className="w-full bg-slate-50 border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nomor Rekening</label>
            <input
              type="text"
              value={settings.bank_account_number}
              onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
              className="w-full bg-slate-50 border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Atas Nama Rekening</label>
            <input
              type="text"
              value={settings.bank_account_holder}
              onChange={(e) => setSettings({ ...settings, bank_account_holder: e.target.value })}
              className="w-full bg-slate-50 border rounded-lg p-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Tarif Standar Ongkir Kurir (Rp)</label>
          <input
            type="number"
            min={0}
            value={settings.shipping_cost}
            onChange={(e) => setSettings({ ...settings, shipping_cost: Number(e.target.value) })}
            className="w-full bg-slate-50 border rounded-lg p-2"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
            <input
              type="checkbox"
              checked={settings.is_store_open}
              onChange={(e) => setSettings({ ...settings, is_store_open: e.target.checked })}
              className="rounded text-brand-blue"
            />
            Status Toko: Buka Menerima Pesanan Online
          </label>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-semibold shadow-sm"
          >
            <Save className="w-4 h-4" /> Simpan Perubahan Toko
          </button>
        </div>
      </form>
    </div>
  )
}
