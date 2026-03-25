import { createGroq } from '@ai-sdk/groq'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createTask } from '@/lib/actions/tasks'
import { getLedgerEntries, createLedgerEntry } from '@/lib/actions/ledger'
import { createCalendarEvent } from '@/lib/google/calendar'
import { createGmailDraft } from '@/lib/google/gmail'
import { TaskPriority } from '@/types/tasks'
import { LedgerType } from '@/types/ledger'

export const maxDuration = 30

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
    return new Response(
      JSON.stringify({ error: "API Key Faltante. Añade tu GROQ_API_KEY en el archivo .env.local" }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json()
    const messages = body.messages as any[]

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY
    })

    const coreMessages = messages.map((m: any) => {
      let textContent = m.content
      if (!textContent && m.parts && Array.isArray(m.parts)) {
        textContent = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('\n')
      }
      return { role: m.role as 'user' | 'assistant' | 'system', content: textContent || '' }
    })

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile') as any,
      messages: coreMessages,
      system: `Eres "Focus Assist", el copiloto inteligente de FocusFinance OS.
Tu objetivo es ayudar al usuario a gestionar su productividad y finanzas de forma eficiente.

Capacidades:
1. Tareas: Puedes crear tareas en la matriz de Eisenhower.
2. Finanzas: Puedes registrar gastos/ingresos y consultar el historial financiero.
3. Google Calendar: Puedes agendar eventos y sesiones de enfoque.
4. Gmail: Puedes crear borradores de correos y reportes.

Tono: Profesional, ejecutivo, minimalista y motivador.
Reglas:
- Si el usuario te pide crear una tarea, pregunta solo lo necesario (título, prioridad).
- Si registras una transaccion, confirma los detalles.
- Para eventos de calendario, confirma fecha y hora.
- Usa siempre un lenguaje claro y conciso.`,
      tools: {
        create_task: tool({
          description: 'Create a new task in the Eisenhower matrix system.',
          parameters: z.object({
            title: z.string().describe('The title or name of the task.'),
            priority: z.enum(['urgent_important', 'important', 'urgent', 'neither']).describe('The priority level.'),
            description: z.string().describe('A very brief description of the task. Pass an empty string if none.')
          }),
          execute: async ({ title, priority, description }) => {
            const task = await createTask({ title, priority: priority as TaskPriority, description })
            return { success: true, task }
          }
        }),
        query_ledger: tool({
          description: 'Fetch and view the recent financial ledger transaction records.',
          parameters: z.object({
            limit: z.number().describe('The maximum number of records to fetch. Pass 10 by default.')
          }),
          execute: async ({ limit }) => {
            const entries = await getLedgerEntries()
            return { entries: entries.slice(0, limit) }
          }
        }),
        add_ledger_entry: tool({
          description: 'Record a new financial transaction (income or expense) into the ledger.',
          parameters: z.object({
            amount: z.number().describe('The monetary amount of the transaction. Must be a standard JSON number.'),
            type: z.enum(['income', 'expense']).describe('The type of the transaction, either income or expense.'),
            description: z.string().describe('A very brief description of the transaction.'),
            category: z.string().describe('The categorical group, such as Food, Salary, Leisure, etc.'),
            transaction_date: z.string().describe('The date of the transaction in ISO format (YYYY-MM-DD). Pass an empty string if unspecified.')
          }),
          execute: async ({ amount, type, description, category, transaction_date }) => {
            const entry = await createLedgerEntry({
              amount,
              type: type as LedgerType,
              description,
              category,
              transaction_date: transaction_date || new Date().toISOString().split('T')[0]
            })
            return { success: true, entry }
          }
        }),
        create_calendar_event: tool({
          description: 'Schedule a new event in Google Calendar.',
          parameters: z.object({
            summary: z.string().describe('The title of the calendar event.'),
            start: z.string().describe('The start datetime in ISO 8601 format.'),
            end: z.string().describe('The end datetime in ISO 8601 format.'),
            description: z.string().describe('The description of the event. Pass an empty string if none.')
          }),
          execute: async (params) => {
            const event = await createCalendarEvent(params as any)
            return { success: true, event }
          }
        }),
        create_gmail_draft: tool({
          description: 'Create a draft email message in Gmail.',
          parameters: z.object({
            to: z.string().describe('The recipient email address.'),
            subject: z.string().describe('The subject line of the email.'),
            body: z.string().describe('The HTML string body of the email message.')
          }),
          execute: async (params) => {
            const draft = await createGmailDraft(params as any)
            return { success: true, draft }
          }
        })
      }
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
