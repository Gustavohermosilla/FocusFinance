import { Coins, Timer, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownLeft, BrainCircuit } from 'lucide-react'
import { getTasks } from '@/lib/actions/tasks'
import { getLedgerEntries } from '@/lib/actions/ledger'
import { PomodoroTimer } from '@/components/focus/PomodoroTimer'

export default async function DashboardPage() {
  const tasks = await getTasks()
  const entries = await getLedgerEntries()

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasks = tasks.length
  
  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const totalExpenses = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const netBalance = totalIncome - totalExpenses

  const pendingTasks = tasks.filter(t => t.status === 'pending').slice(0, 5)

  return (
    <div className="space-y-10 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">OS Dashboard</h1>
          <p className="text-muted font-medium">Elevate your focus. Balance your life.</p>
        </div>
        <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-surface flex items-center justify-center text-[10px] font-bold text-focus shadow-xl">
                    FF
                </div>
            ))}
        </div>
      </header>

      {/* Main Grid: Focus Center vs Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Stats & Financial (Blurs on Focus) */}
        <div className="lg:col-span-8 space-y-8 blur-on-focus transition-all duration-700">
           
           {/* Mobile-Style Stat Cards */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <ModernStatCard title="Focus" value="4.2h" icon={BrainCircuit} color="text-focus" />
               <ModernStatCard title="Tasks" value={`${completedTasks}/${totalTasks}`} icon={CheckCircle2} color="text-finance" />
               <ModernStatCard title="Coins" value="1.2k" icon={Coins} color="text-amber-400" />
               <ModernStatCard title="Net" value={`$${Math.floor(netBalance/1000)}k`} icon={TrendingUp} color="text-finance" />
           </div>

           {/* Financial Activity Section */}
           <div className="bg-surface/30 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
                <button className="text-xs font-bold text-focus hover:underline">View Ledger</button>
             </div>
             
             <div className="space-y-4">
               {entries.slice(0, 4).map((entry) => (
                 <div key={entry.id} className="group flex justify-between items-center p-5 bg-background/20 rounded-3xl border border-white/5 hover:bg-background/40 transition-all">
                   <div className="flex items-center gap-5">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${entry.type === 'income' ? 'bg-finance/10 text-finance' : 'bg-rose-500/10 text-rose-500'}`}>
                        {entry.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                     </div>
                     <div>
                       <p className="font-bold text-white">{entry.description}</p>
                       <p className="text-xs font-bold text-muted uppercase tracking-widest">{entry.category}</p>
                     </div>
                   </div>
                   <div className={`text-lg font-black ${entry.type === 'income' ? 'text-finance' : 'text-rose-500'}`}>
                     {entry.type === 'income' ? '+' : '-'}${Number(entry.amount).toLocaleString()}
                   </div>
                 </div>
               ))}
               {entries.length === 0 && <p className="text-muted italic text-center py-12">No data yet</p>}
             </div>
           </div>
        </div>

        {/* Right Column: Focus Center (Does NOT blur) */}
        <div className="lg:col-span-4 space-y-8 sticky top-8">
            <h2 className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-4 text-center">Focus Center</h2>
            <PomodoroTimer />

            {/* Compact Task List in Focus Center */}
            <div className="bg-surface/30 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/5">
                <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Top Priorities</h3>
                <div className="space-y-2">
                    {pendingTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className={`w-2 h-2 rounded-full ${
                                task.priority === 'urgent_important' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                task.priority === 'important' ? 'bg-finance shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                'bg-focus'
                            }`} />
                            <p className="text-xs font-bold text-white truncate">{task.title}</p>
                        </div>
                    ))}
                    {pendingTasks.length === 0 && <p className="text-[10px] text-muted text-center py-4">No critical tasks</p>}
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

function ModernStatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
    return (
        <div className="bg-surface/30 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center space-y-2 group hover:bg-surface/50 transition-all cursor-default">
            <div className={`p-3 rounded-2xl bg-background/50 group-hover:scale-110 transition-transform ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">{title}</p>
                <p className="text-xl font-black text-white tracking-tighter">{value}</p>
            </div>
        </div>
    )
}
