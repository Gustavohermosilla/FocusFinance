'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // If profile doesn't exist, create it (should be handled by a trigger in a real app, 
    // but we can do it here as a fallback)
    if (error.code === 'PGRST116') {
      const { data: newProfile } = await supabase
        .from('users_profiles')
        .insert([{ user_id: user.id, display_name: user.user_metadata.full_name || user.email }])
        .select()
        .single()
      return newProfile
    }
    return null
  }

  return data
}

export async function addFocusCoins(amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('users_profiles')
    .select('focus_coins')
    .eq('user_id', user.id)
    .single()

  const currentCoins = profile?.focus_coins || 0
  const newCoins = currentCoins + amount

  const { error } = await supabase
    .from('users_profiles')
    .update({ focus_coins: newCoins })
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
  return newCoins
}
