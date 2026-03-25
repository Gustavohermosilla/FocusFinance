import { AIAssistant } from '@/components/ai/AIAssistant'

export default function AssistantPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 bg-focus/20 rounded-2xl flex items-center justify-center text-focus mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-4">Panel de Control de IA</h1>
      <p className="text-muted max-w-md mb-8">
        Puedes hablar con Focus Assist usando la burbuja abajo a la derecha o presionando Cmd+K.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full text-left">
        <div className="p-4 bg-surface border border-white/5 rounded-2xl">
          <h4 className="text-sm font-bold text-focus mb-1">Productividad</h4>
          <p className="text-xs text-muted">"Añade una tarea urgente para mañana a las 9am"</p>
        </div>
        <div className="p-4 bg-surface border border-white/5 rounded-2xl">
          <h4 className="text-sm font-bold text-finance mb-1">Finanzas</h4>
          <p className="text-xs text-muted">"Registra un gasto de $15 en café hoy"</p>
        </div>
      </div>
    </div>
  )
}
