import { getTasks } from '@/lib/actions/tasks'
import { EisenhowerMatrix } from '@/components/tasks/EisenhowerMatrix'
import { Plus } from 'lucide-react'
import { CreateTaskWrapper } from '@/components/tasks/CreateTaskWrapper'

export default async function TasksPage() {
  const tasks = await getTasks()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Matriz de Eisenhower</h1>
          <p className="text-muted mt-1">Organiza tus tareas por importancia y urgencia.</p>
        </div>
        <CreateTaskWrapper />
      </div>

      <EisenhowerMatrix initialTasks={tasks} />
    </div>
  )
}
