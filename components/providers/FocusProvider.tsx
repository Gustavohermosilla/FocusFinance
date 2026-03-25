'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface FocusContextType {
  isFocusMode: boolean
  setIsFocusMode: (value: boolean) => void
  coins: number
  addCoins: (amount: number) => void
  setCoins: (amount: number) => void
}

const FocusContext = createContext<FocusContextType | undefined>(undefined)

export function FocusProvider({ children, initialCoins = 0 }: { children: React.ReactNode, initialCoins?: number }) {
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [coins, setCoins] = useState(initialCoins)

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount)
    // Here we'll eventually call a server action to sync with Supabase
  }

  return (
    <FocusContext.Provider value={{ isFocusMode, setIsFocusMode, coins, addCoins, setCoins }}>
      <div className={isFocusMode ? 'focus-mode-active' : ''}>
        {children}
      </div>
      
      {isFocusMode && (
        <div className="fixed inset-0 pointer-events-none z-[40] transition-all duration-1000">
           {/* Visual cues for Focus Mode could go here if needed globally */}
        </div>
      )}

      <style jsx global>{`
        .focus-mode-active .blur-on-focus {
          filter: blur(8px);
          pointer-events: none;
          opacity: 0.5;
          transition: all 0.5s ease;
        }
      `}</style>
    </FocusContext.Provider>
  )
}

export const useFocus = () => {
  const context = useContext(FocusContext)
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider')
  }
  return context
}
