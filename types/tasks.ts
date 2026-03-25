export type TaskPriority = 'urgent_important' | 'important' | 'urgent' | 'neither';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  focus_coins_reward: number;
  google_calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  due_date?: string;
};
