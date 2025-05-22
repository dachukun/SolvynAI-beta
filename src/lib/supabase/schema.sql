-- Supabase Table Definitions

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks Table
-- Stores individual to-do items
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL CHECK (char_length(text) > 0),
    description TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category TEXT,
    tags TEXT[],
    due_date TIMESTAMPTZ,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS) for the tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies for tasks table
-- Users can only see and manage their own tasks
CREATE POLICY "Allow users to manage their own tasks" ON public.tasks
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- Focus Sessions Table
-- Logs focus sessions, potentially linked to tasks
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL, -- Link to a task, optional
    custom_task_description TEXT, -- If the user types a custom task for the session
    start_time TIMESTAMPTZ DEFAULT now() NOT NULL,
    end_time TIMESTAMPTZ,
    planned_duration_minutes INTEGER NOT NULL CHECK (planned_duration_minutes > 0), -- Original selected duration
    actual_duration_seconds INTEGER, -- Actual time spent if different from planned or if interrupted
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'interrupted')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_focus_sessions_updated_at
    BEFORE UPDATE ON public.focus_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS) for the focus_sessions table
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for focus_sessions table
-- Users can only see and manage their own focus sessions
CREATE POLICY "Allow users to manage their own focus sessions" ON public.focus_sessions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- Example of how to add a comment to a table or column for documentation
COMMENT ON TABLE public.tasks IS 'Stores individual to-do items for users.';
COMMENT ON COLUMN public.tasks.priority IS 'Priority of the task: low, medium, or high.';
COMMENT ON TABLE public.focus_sessions IS 'Logs user focus sessions, duration, and status.';
COMMENT ON COLUMN public.focus_sessions.task_id IS 'Optional link to a task from the tasks table.';

-- Note: You should run these SQL statements in your Supabase project's SQL editor.
-- Ensure that the `auth.users` table exists (it's standard in Supabase projects with authentication).