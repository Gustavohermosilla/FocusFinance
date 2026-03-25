'use client'

import { LedgerEntry } from '@/types/ledger'
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { deleteLedgerEntry } from '@/lib/actions/ledger'

export function LedgerList({ entries }: { entries: LedgerEntry[] }) {
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      await deleteLedgerEntry(id)
    }
  }

  return (
    <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase tracking-wider text-muted font-bold">
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4 text-right">Monto</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map((entry) => (
              <tr key={entry.id} className="group hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-xs text-muted">
                  {format(parseISO(entry.transaction_date), 'dd MMM, yyyy', { locale: es })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${entry.type === 'income' ? 'bg-finance/10 text-finance' : 'bg-rose-500/10 text-rose-500'}`}>
                      {entry.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                    </div>
                    <span className="text-sm font-medium text-white">{entry.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-background text-[10px] font-bold text-muted rounded-md uppercase border border-white/5">
                    {entry.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${entry.type === 'income' ? 'text-finance' : 'text-rose-500'}`}>
                  {entry.type === 'income' ? '+' : '-'}${entry.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-muted hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <div className="p-12 text-center text-muted italic">
            No hay registros financieros aún.
          </div>
        )}
      </div>
    </div>
  )
}
