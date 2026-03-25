'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CreateLedgerInput, LedgerEntry } from '@/types/ledger'

export async function getLedgerEntries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ledger')
    .select('*')
    .order('transaction_date', { ascending: false })

  if (error) {
    console.error('Error fetching ledger:', error)
    return []
  }

  return data
}

export async function createLedgerEntry(input: CreateLedgerInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('ledger')
    .insert([{ ...input, user_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error('Error creating ledger entry:', error)
    throw new Error('Failed to create entry')
  }

  revalidatePath('/finance')
  revalidatePath('/dashboard')
  return data
}

export async function deleteLedgerEntry(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('ledger')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting ledger entry:', error)
    throw new Error('Failed to delete entry')
  }

  revalidatePath('/finance')
  revalidatePath('/dashboard')
}
