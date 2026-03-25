'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateLedgerForm } from './CreateLedgerForm'

export function CreateLedgerWrapper() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-finance hover:bg-finance/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-finance/20"
      >
        <Plus className="w-4 h-4" />
        Añadir Registro
      </button>

      {isOpen && <CreateLedgerForm onOpenChange={setIsOpen} />}
    </>
  )
}
