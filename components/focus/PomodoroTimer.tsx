'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain, Bell, Settings2 } from 'lucide-react'
import { useFocus } from '@/components/providers/FocusProvider'
import { addFocusCoins } from '@/lib/actions/profile'
import { logPomodoroSession } from '@/lib/actions/focus'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const MODE_SETTINGS = {
  work: { duration: 25 * 60, label: 'Enfoque', color: 'text-focus', bg: 'bg-focus' },
  shortBreak: { duration: 5 * 60, label: 'Descanso Corto', color: 'text-finance', bg: 'bg-finance' },
  longBreak: { duration: 15 * 60, label: 'Descanso Largo', color: 'text-finance', bg: 'bg-finance' },
}

export function PomodoroTimer() {
  const { isFocusMode, setIsFocusMode, addCoins } = useFocus()
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(MODE_SETTINGS[mode].duration)
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-state')
    if (saved) {
      const { savedTime, savedMode, savedIsActive, timestamp } = JSON.parse(saved)
      const elapsed = Math.floor((Date.now() - timestamp) / 1000)
      
      if (savedIsActive) {
        const remaining = Math.max(0, savedTime - elapsed)
        setTimeLeft(remaining)
        setMode(savedMode)
        setIsActive(remaining > 0)
      } else {
        setTimeLeft(savedTime)
        setMode(savedMode)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    const state = {
      savedTime: timeLeft,
      savedMode: mode,
      savedIsActive: isActive,
      timestamp: Date.now()
    }
    localStorage.setItem('pomodoro-state', JSON.stringify(state))
  }, [timeLeft, mode, isActive])

  const handleComplete = useCallback(async () => {
    setIsActive(false)
    if (mode === 'work') {
      const reward = 10
      try {
        await addFocusCoins(reward)
        addCoins(reward)
        await logPomodoroSession({
          durationMinutes: 25,
          completed: true
        })
        // Play notification sound or show toast in a real app
        new Notification("FocusComplete!", { body: "¡Buen trabajo! Has ganado 10 Focus Coins." })
      } catch (error) {
        console.error("Failed to sync session:", error)
      }
      setIsFocusMode(false)
    }
    // Switch to break automatically if desired
    setMode(mode === 'work' ? 'shortBreak' : 'work')
    setTimeLeft(MODE_SETTINGS[mode === 'work' ? 'shortBreak' : 'work'].duration)
  }, [mode, setIsFocusMode, addCoins])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      handleComplete()
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isActive, timeLeft, handleComplete])

  const toggleTimer = () => {
    if (!isActive && mode === 'work') {
      setIsFocusMode(true)
    } else if (isActive && mode === 'work') {
      // Maybe Don't disable focus mode immediately on pause? 
      // Spec says "During active session", so we keep it if paused briefly
    }
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(MODE_SETTINGS[mode].duration)
    if (mode === 'work') setIsFocusMode(false)
  }

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false)
    setMode(newMode)
    setTimeLeft(MODE_SETTINGS[newMode].duration)
    if (newMode === 'work') {
      // focus mode only on start
    } else {
      setIsFocusMode(false)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const progress = ((MODE_SETTINGS[mode].duration - timeLeft) / MODE_SETTINGS[mode].duration) * 100

  return (
    <div className="bg-surface/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl space-y-8 flex flex-col items-center">
      <div className="flex bg-background/50 p-1 rounded-2xl border border-white/5 w-full">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              mode === m 
                ? `${MODE_SETTINGS[m].bg} text-white shadow-lg` 
                : 'text-muted hover:text-white'
            }`}
          >
            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Break' : 'Long'}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Progress Ring */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            className={`fill-none transition-all duration-1000 ${MODE_SETTINGS[mode].color}`}
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
          <span className="text-5xl font-black text-white tabular-nums tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className={`text-xs font-bold uppercase tracking-widest ${MODE_SETTINGS[mode].color}`}>
            {MODE_SETTINGS[mode].label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-3 bg-white/5 hover:bg-white/10 text-muted hover:text-white rounded-full transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`p-6 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${
            isActive 
              ? 'bg-white/10 text-white' 
              : `${MODE_SETTINGS[mode].bg} text-white shadow-${MODE_SETTINGS[mode].color}/20`
          }`}
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>

        <button className="p-3 bg-white/5 hover:bg-white/10 text-muted hover:text-white rounded-full transition-all">
          <Settings2 className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-muted text-[10px] font-bold uppercase">
          <Brain className="w-4 h-4 text-focus" />
          Sesiones de hoy: 0
        </div>
        <div className="flex items-center gap-2 text-muted text-[10px] font-bold uppercase">
          <Coffee className="w-4 h-4 text-finance" />
          Descansos: 0
        </div>
      </div>
    </div>
  )
}
