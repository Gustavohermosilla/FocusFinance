'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateTaskInput, TaskPriority, TaskStatus } from '@/types/tasks'

export async function getTasks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }

  return data
}

export async function createTask(input: CreateTaskInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...input, user_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return data
}

import { addFocusCoins } from '@/lib/actions/profile'

export async function updateTask(id: string, updates: Partial<CreateTaskInput & { status: TaskStatus }>) {
  const supabase = await createClient()
  
  // If moving to completed, handle rewards
  if (updates.status === 'completed') {
    const { data: task } = await supabase
      .from('tasks')
      .select('status, priority')
      .eq('id', id)
      .single()

    if (task && task.status !== 'completed') {
      const reward = task.priority === 'urgent_important' ? 25 : 
                     task.priority === 'important' ? 15 : 10
      await addFocusCoins(reward)
    }
  }

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task')
  }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting task:', error)
    throw new Error('Failed to delete task')
  }

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function updateTaskPriority(id: string, priority: TaskPriority) {
  return updateTask(id, { priority })
}
