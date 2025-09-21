"use client"

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskColumn } from './task-column'
import { TaskCard } from './task-card'
import { useSocket } from '@/contexts/socket-context'
import { toast } from 'sonner' // We'll add this for notifications

// Task type (same as before)
type Task = {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: string
  dueDate: string | null
  assignee: {
    id: string
    name: string | null
    email: string
  } | null
  createdAt: string
}

// Column definitions (same as before)
const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-100 text-gray-700' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { id: 'REVIEW', title: 'Review', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'DONE', title: 'Done', color: 'bg-green-100 text-green-700' }
] as const

interface TaskBoardProps {
  tasks: Task[]
  projectId: string
  onTaskStatusUpdate: (taskId: string, status: Task['status']) => void
}

export function TaskBoard({ tasks, projectId, onTaskStatusUpdate }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks)
  const { socket, isConnected, onlineUsers } = useSocket()

  // Update local tasks when props change
  useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  // Socket event listeners
  useEffect(() => {
    if (!socket || !projectId) return

    // Join the project room once per mount
    socket.emit('join-project', projectId)

    // Listen for real-time task updates
    const onTaskUpdated = (data: { taskId: string; status: Task['status'] }) => {
      console.log('Received real-time task update:', data)
      setLocalTasks(prevTasks => {
        const taskBefore = prevTasks.find(t => t.id === data.taskId)
        const next = prevTasks.map(task =>
          task.id === data.taskId ? { ...task, status: data.status } : task
        )
        if (taskBefore) {
          toast.info(`"${taskBefore.title}" moved to ${String(data.status).replace('_', ' ')}`)
        }
        return next
      })
    }

    const onProjectActivity = (data: { message: string }) => {
      toast.info(data.message)
    }

    socket.on('task-updated', onTaskUpdated)
    socket.on('project-activity', onProjectActivity)

    // Cleanup
    return () => {
      socket.emit('leave-project', projectId)
      socket.off('task-updated', onTaskUpdated)
      socket.off('project-activity', onProjectActivity)
    }
  }, [socket, projectId])

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = localTasks.filter(task => task.status === column.id)
    return acc
  }, {} as Record<string, Task[]>)

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = localTasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const taskId = active.id as string
      const newStatus = over.id as Task['status']

      // Check if dropping on a valid column
      const validStatuses = COLUMNS.map(col => col.id)
      if (validStatuses.includes(newStatus)) {
        // Update local state optimistically
        setLocalTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        )

        // Emit socket event for real-time updates
        if (socket) {
          socket.emit('task-status-change', {
            taskId,
            status: newStatus,
            projectId
          })
        }

        // Update database
        onTaskStatusUpdate(taskId, newStatus)
      }
    }

    setActiveTask(null)
  }

  return (
    <div className="space-y-6">
      {/* Connection Status & Online Users */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 text-sm ${
            isConnected ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>

          {onlineUsers.size > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{onlineUsers.size} online:</span>
              <div className="flex space-x-1">
                {Array.from(onlineUsers.entries()).map(([userId, userName]) => (
                  <div
                    key={userId}
                    className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs"
                    title={userName}
                  >
                    {userName.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Board */}
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id]}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}