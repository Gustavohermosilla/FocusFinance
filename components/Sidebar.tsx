'use client'

import Link from 'next/link'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Settings, 
  MessageSquare, 
  Timer,
  Coins,
  BrainCircuit
} from 'lucide-react'
import { useFocus } from '@/components/providers/FocusProvider'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Wallet, label: 'Finance', href: '/finance' },
  { icon: MessageSquare, label: 'AI Assistant', href: '/assistant' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar({ userProfile }: { userProfile: any }) {
  const { coins, isFocusMode, setIsFocusMode } = useFocus()

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-surface border-r border-white/5 flex flex-col p-4 shadow-2xl">
      <div className="mb-8 px-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white tracking-tight">
          FocusFinance <span className="text-focus">OS</span>
        </h1>
        <button 
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`p-1.5 rounded-lg transition-all ${isFocusMode ? 'bg-focus text-white' : 'bg-white/5 text-muted hover:text-white'}`}
          title={isFocusMode ? "Deactivate Focus Mode" : "Activate Focus Mode"}
        >
          <BrainCircuit className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
          >
            <item.icon className="w-4 h-4 group-hover:text-focus transition-colors" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
        <div className="px-3 py-2 bg-background/50 rounded-xl space-y-2 border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted">Focus Coins</span>
            <div className="flex items-center gap-1 text-focus font-bold">
              <Coins className="w-3 h-3" />
              {coins.toLocaleString()}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted">Balance</span>
            <div className="text-finance font-bold">$2,450</div>
          </div>
        </div>
        
        <div className="px-2 flex items-center gap-2">
          {userProfile?.avatar_url ? (
            <img src={userProfile.avatar_url} className="w-8 h-8 rounded-full border border-white/10" alt="Avatar" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-focus/20 flex items-center justify-center text-[10px] font-bold text-focus border border-focus/20">
              {userProfile?.display_name?.substring(0, 2).toUpperCase() || 'FF'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userProfile?.display_name || 'Usuário'}</p>
            <p className="text-[10px] text-muted truncate">Focus Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
