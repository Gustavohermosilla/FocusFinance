'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Terminal,
  Maximize2,
  Minimize2,
  BrainCircuit,
  Command
} from 'lucide-react'

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const {
    messages = [],
    sendMessage,
    status,
    error,
    stop
  } = useChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hola. Soy Focus Assist. ¿En qué puedo ayudarte a optimizar tu día?'
      }
    ]
  }) as any

  const isStreaming = status === 'streaming'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage({ text: input })
    setInput('')
  }

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((prev: boolean) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-focus hover:bg-focus/90 text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group z-50"
      >
        <div className="absolute -top-12 right-0 bg-surface border border-white/5 py-1 px-3 rounded-lg text-[10px] font-bold text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <Command className="w-2 h-2 inline mr-1" /> K para abrir
        </div>
        <BrainCircuit className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-8 right-8 ${isExpanded ? 'w-[600px] h-[80vh]' : 'w-96 h-[600px]'} bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col z-50 transition-all duration-500 overflow-hidden`}>
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-focus/20 flex items-center justify-center text-focus">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Focus Assist</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-finance animate-pulse" />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">En línea</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-muted hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-muted hover:text-rose-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-white/5 text-muted' : 'bg-focus text-white shadow-lg shadow-focus/20'
                }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${m.role === 'user'
                  ? 'bg-focus text-white'
                  : 'bg-white/5 text-white border border-white/5'
                }`}>
                {!m.parts || m.parts.length === 0 ? (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                ) : (
                  m.parts.map((part: any, i: number) =>
                    part.type === 'text' ? (
                      <div key={i} className="whitespace-pre-wrap">{part.text}</div>
                    ) : part.type === 'reasoning' ? (
                      <div key={i} className="text-xs opacity-50 italic mb-2 border-l border-white/20 pl-2">
                        {part.text}
                      </div>
                    ) : null
                  )
                )}

                {/* Tool Invocations Rendering */}
                {m.toolInvocations?.map((toolInvocation: any) => {
                  const { toolName, toolCallId, state } = toolInvocation;
                  if (state === 'result') {
                    return (
                      <div key={toolCallId} className="mt-3 p-3 bg-finanXce/10 border border-finance/20 rounded-xl flex items-center gap-2 text-xs text-finance font-bold">
                        <Terminal className="w-3 h-3" />
                        Acción completada: {toolName.replace('_', ' ')}
                      </div>
                    );
                  }
                  return (
                    <div key={toolCallId} className="mt-3 p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2 text-xs text-muted">
                      <span className="w-2 h-2 rounded-full bg-focus animate-bounce" />
                      Ejecutando {toolName.replace('_', ' ')}...
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-focus text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-surface/50 border border-white/5 rounded-2xl flex gap-1">
                <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                <X className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl text-sm bg-red-500/10 text-red-400 border border-red-500/20 whitespace-pre-wrap">
                {error.message || "Ha ocurrido un error inesperado al procesar tu solicitud."}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleFormSubmit} className="p-6 pt-0">
        <div className="relative">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe algo... (ej: 'Añadir gasto de $50')"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-focus/50 transition-all placeholder:text-muted/50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input?.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-focus text-white rounded-xl hover:bg-focus/90 disabled:opacity-50 disabled:hover:bg-focus transition-all shadow-lg shadow-focus/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-4 text-[10px] text-center text-muted font-bold uppercase tracking-widest">
          Empoderado por Focus AI Engine
        </p>
      </form>
    </div>
  )
}
