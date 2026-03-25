'use client'

import { useState } from 'react'
import { Task, TaskPriority } from '@/types/tasks'
import { Plus, MoreVertical, CheckCircle2, Circle } from 'lucide-react'
import { updateTask, updateTaskPriority } from '@/lib/actions/tasks'

interface EisenhowerMatrixProps {
  initialTasks: Task[]
}

const quadrants: { id: TaskPriority; title: string; color: string }[] = [
  { id: 'urgent_important', title: 'Urgente + Importante', color: 'border-rose-500/50 text-rose-500' },
  { id: 'important', title: 'Importante', color: 'border-finance/50 text-finance' },
  { id: 'urgent', title: 'Urgente', color: 'border-focus/50 text-focus' },
  { id: 'neither', title: 'Ni Urgente ni Importante', color: 'border-muted/50 text-muted' },
]

export function EisenhowerMatrix({ initialTasks }: EisenhowerMatrixProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    
    try {
      await updateTask(task.id, { status: newStatus })
    } catch (error) {
      setTasks(tasks) // Rollback
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
      {quadrants.map((quadrant) => (
        <div 
          key={quadrant.id} 
          className={`bg-surface rounded-2xl p-5 border-2 ${quadrant.color} min-h-[300px] flex flex-col`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider">{quadrant.title}</h3>
            <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 space-y-3">
            {tasks
              .filter(t => t.priority === quadrant.id)
              .map(task => (
                <div 
                  key={task.id} 
                  className="group bg-background/50 border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => handleToggleComplete(task)}
                      className="mt-0.5 text-muted hover:text-finance transition-colors"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-finance" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium transition-all ${task.status === 'completed' ? 'text-muted line-through' : 'text-white'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[10px] text-muted truncate mt-1">{task.description}</p>
                      )}
                    </div>
                    <MoreVertical className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            
            {tasks.filter(t => t.priority === quadrant.id).length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-8">
                <Plus className="w-8 h-8 mb-2" />
                <p className="text-xs">No hay tareas</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
