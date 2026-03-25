'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createLedgerEntry } from '@/lib/actions/ledger'
import { LedgerType } from '@/types/ledger'

export function CreateLedgerForm({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createLedgerEntry({
        amount: parseFloat(formData.get('amount') as string),
        type: formData.get('type') as LedgerType,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        transaction_date: formData.get('transaction_date') as string,
        currency: 'USD',
      })
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-lg rounded-2xl border border-white/5 shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Nuevo Registro</h2>
          <button onClick={() => onOpenChange(false)} className="text-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Monto</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                required
                className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Tipo</label>
              <select
                name="type"
                required
                className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors"
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Categoría</label>
            <input
              name="category"
              required
              className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors"
              placeholder="Ej: Alimentación, Ocio, Salario..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Descripción</label>
            <input
              name="description"
              className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors"
              placeholder="¿En qué consistió?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Fecha</label>
            <input
              name="transaction_date"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-finance hover:bg-finance/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Añadir Registro'}
          </button>
        </form>
      </div>
    </div>
  )
}
