'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createTask } from '@/lib/actions/tasks'
import { TaskPriority } from '@/types/tasks'

export function CreateTaskForm({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createTask({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        priority: formData.get('priority') as TaskPriority,
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
          <h2 className="text-xl font-bold text-white">Nueva Tarea</h2>
          <button onClick={() => onOpenChange(false)} className="text-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Título</label>
            <input
              name="title"
              required
              className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors"
              placeholder="¿Qué hay que hacer?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Descripción (Opcional)</label>
            <textarea
              name="description"
              className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors h-24 resize-none"
              placeholder="Más detalles..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Prioridad (Matriz Eisenhower)</label>
            <select
              name="priority"
              required
              className="w-full bg-background border border-white/5 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-focus transition-colors"
            >
              <option value="urgent_important">Urgente + Importante (Hacer ahora)</option>
              <option value="important">Importante (Programar)</option>
              <option value="urgent">Urgente (Delegar)</option>
              <option value="neither">Ni Urgente ni Importante (Eliminar)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-focus hover:bg-focus/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Tarea'}
          </button>
        </form>
      </div>
    </div>
  )
}
