'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateTaskForm } from './CreateTaskForm'

export function CreateTaskWrapper() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-focus hover:bg-focus/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-focus/20"
      >
        <Plus className="w-4 h-4" />
        Añadir Tarea
      </button>

      {isOpen && <CreateTaskForm onOpenChange={setIsOpen} />}
    </>
  )
}
