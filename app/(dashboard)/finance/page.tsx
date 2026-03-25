import { getLedgerEntries } from '@/lib/actions/ledger'
import { LedgerList } from '@/components/finance/LedgerList'
import { FinanceCharts } from '@/components/finance/FinanceCharts'
import { CreateLedgerWrapper } from '@/components/finance/CreateLedgerWrapper'
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react'

export default async function FinancePage() {
  const entries = await getLedgerEntries()
  
  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0)
    
  const totalExpenses = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Finanzas Personales</h1>
          <p className="text-muted mt-1">Controla tus ingresos y gastos de forma simple.</p>
        </div>
        <CreateLedgerWrapper />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 text-muted text-xs font-bold uppercase tracking-wider mb-4">
            <Wallet className="w-4 h-4" />
            Balance Total
          </div>
          <div className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-rose-500'}`}>
            ${balance.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-surface rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 text-finance text-xs font-bold uppercase tracking-wider mb-4">
            <ArrowUpRight className="w-4 h-4" />
            Ingresos Totales
          </div>
          <div className="text-3xl font-bold text-white">
            +${totalIncome.toLocaleString()}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 text-rose-500 text-xs font-bold uppercase tracking-wider mb-4">
            <ArrowDownLeft className="w-4 h-4" />
            Gastos Totales
          </div>
          <div className="text-3xl font-bold text-white">
            -${totalExpenses.toLocaleString()}
          </div>
        </div>
      </div>

      <FinanceCharts entries={entries} />

      <LedgerList entries={entries} />
    </div>
  )
}
