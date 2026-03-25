import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback'

export function getOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

export async function getAuthorizedClient() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .select('google_access_token, google_refresh_token')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) throw new Error('Google tokens not found')

  const oauth2Client = getOAuth2Client()
  
  oauth2Client.setCredentials({
    access_token: profile.google_access_token,
    refresh_token: profile.google_refresh_token,
  })

  // Optional: Check if token is expired and refresh
  // Google SDK handles refresh automatically if refresh_token is present when a request is made
  // and we can listen to the 'tokens' event to save the new access_token.
  
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await supabase
        .from('users_profiles')
        .update({ google_access_token: tokens.access_token })
        .eq('user_id', user.id)
    }
  })

  return oauth2Client
}
