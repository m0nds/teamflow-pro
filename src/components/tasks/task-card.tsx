"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, GripVertical, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

// Task type
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

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  // Set up draggable behavior
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  // Drag transform styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'URGENT':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // Check if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? 'opacity-50 z-50' : 'opacity-100'}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`
        cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md
        ${isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}
      `}>
        <CardHeader className="pb-3">
          {/* Header with drag handle and menu */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <GripVertical className="w-4 h-4" />
              </button>
              
              {/* Task Title */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Menu Button */}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>

          {/* Priority Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`text-xs ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Due Date */}
          {task.dueDate && (
            <div className={`
              flex items-center text-xs mb-3
              ${isOverdue ? 'text-red-600' : 'text-gray-600'}
            `}>
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {isOverdue ? 'Overdue: ' : 'Due: '}
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center text-xs text-gray-600">
              <Avatar className="w-5 h-5 mr-2">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {task.assignee.name?.charAt(0) || task.assignee.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">
                {task.assignee.name || task.assignee.email}
              </span>
            </div>
          )}

          {/* Created Date */}
          <div className="text-xs text-gray-400 mt-2">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}