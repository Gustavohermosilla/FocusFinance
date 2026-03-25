'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logPomodoroSession({
  taskId,
  durationMinutes,
  completed
}: {
  taskId?: string,
  durationMinutes: number,
  completed: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .insert([{
      user_id: user.id,
      task_id: taskId || null,
      duration_minutes: durationMinutes,
      completed,
      started_at: new Date(Date.now() - durationMinutes * 60000).toISOString(),
      ended_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error

  revalidatePath('/dashboard')
  return data
}
