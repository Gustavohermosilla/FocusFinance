import { Sidebar } from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FocusProvider } from '@/components/providers/FocusProvider'
import { getUserProfile } from '@/lib/actions/profile'

import { AIAssistant } from '@/components/ai/AIAssistant'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const profile = await getUserProfile()

  return (
    <FocusProvider initialCoins={profile?.focus_coins || 0}>
      <div className="flex min-h-screen bg-background text-foreground">
        <div className="blur-on-focus transition-all duration-500">
          <Sidebar userProfile={profile} />
        </div>
        <main className="flex-1 ml-[240px] p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <AIAssistant />
      </div>
    </FocusProvider>
  )
}
