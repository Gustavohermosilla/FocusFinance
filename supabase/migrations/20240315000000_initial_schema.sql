-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. USERS_PROFILES
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    google_access_token TEXT, -- Encrypted at app level or via trigger with pgcrypto
    google_refresh_token TEXT, -- Encrypted at app level or via trigger with pgcrypto
    monthly_budget NUMERIC(12,2) DEFAULT 0,
    preferred_currency CHAR(3) DEFAULT 'USD',
    focus_coins INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.users_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.users_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- 2. LEDGER
CREATE TABLE IF NOT EXISTS public.ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    type TEXT CHECK (type IN ('income','expense','transfer')),
    category TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual','ai_agent','import')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ledger" 
ON public.ledger FOR ALL 
USING (auth.uid() = user_id);

-- 3. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('urgent_important','important','urgent','neither')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
    due_date TIMESTAMPTZ,
    focus_coins_reward INTEGER DEFAULT 10,
    google_calendar_event_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks" 
ON public.tasks FOR ALL 
USING (auth.uid() = user_id);

-- 4. POMODORO_SESSIONS
CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 25,
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sessions" 
ON public.pomodoro_sessions FOR ALL 
USING (auth.uid() = user_id);

-- 5. AI_ACTION_LOGS
CREATE TABLE IF NOT EXISTS public.ai_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    input_payload JSONB,
    output_payload JSONB,
    status TEXT CHECK (status IN ('success','failed','pending')),
    external_service TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI logs" 
ON public.ai_action_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER set_updated_at_users_profiles BEFORE UPDATE ON public.users_profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_ledger BEFORE UPDATE ON public.ledger FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_tasks BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_pomodoro_sessions BEFORE UPDATE ON public.pomodoro_sessions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at_ai_action_logs BEFORE UPDATE ON public.ai_action_logs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
