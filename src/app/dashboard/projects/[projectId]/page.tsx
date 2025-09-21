"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TaskBoard } from '@/components/tasks/task-board'
import { CreateTaskModal } from '@/components/tasks/create-task-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Settings } from 'lucide-react'
import Link from 'next/link'

// TypeScript types
type Project = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
}

type Task = {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: string
  dueDate: string | null
  projectId: string
  assigneeId: string | null
  assignee: {
    id: string
    name: string | null
    email: string
  } | null
  createdAt: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch project details
  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const result = await response.json()
      
      if (result.success) {
        setProject(result.data)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }

  // Fetch tasks for this project
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`)
      const result = await response.json()
      
      if (result.success) {
        setTasks(result.data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data when component mounts
  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [projectId])

  // Refresh tasks when new one is created
  const handleTaskCreated = () => {
    fetchTasks()
  }

  // Handle task status updates from drag & drop
  const handleTaskStatusUpdate = (taskId: string, newStatus: Task['status']) => {
    // Optimistically update local state
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )

    // Update in database
    updateTaskStatus(taskId, newStatus)
  }

  // API call to update task status
  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status })
      })

      if (!response.ok) {
        // Revert optimistic update on error
        fetchTasks()
        console.error('Failed to update task status')
      }
    } catch (error) {
      // Revert optimistic update on error
      fetchTasks()
      console.error('Error updating task status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/dashboard/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            {project.description && (
              <p className="text-gray-600 mt-1">{project.description}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{project.status}</Badge>
              <Badge variant="outline">{project.priority}</Badge>
              {project.dueDate && (
                <Badge variant="outline">
                  Due {new Date(project.dueDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <CreateTaskModal projectId={projectId} onTaskCreated={handleTaskCreated} />
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Task Board */}
      <TaskBoard 
        tasks={tasks}
        projectId={projectId}
        onTaskStatusUpdate={handleTaskStatusUpdate}
      />
    </div>
  )
}