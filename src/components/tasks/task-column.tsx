"use client"

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './task-card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

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

// Column type
type Column = {
  id: string
  title: string
  color: string
}

interface TaskColumnProps {
  column: Column
  tasks: Task[]
}

export function TaskColumn({ column, tasks }: TaskColumnProps) {
  // Set up drop zone for this column
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <Badge 
            variant="secondary" 
            className={`${column.color} text-xs`}
          >
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Drop Zone */}
      <motion.div
        ref={setNodeRef}
        className={`
          flex-1 min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-all duration-200
          ${isOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-200 bg-gray-50/50'
          }
        `}
        animate={{
          scale: isOver ? 1.02 : 1,
          borderColor: isOver ? '#60A5FA' : '#E5E7EB'
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Tasks List */}
        <SortableContext 
          items={tasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-sm">
                  {column.id === 'TODO' ? 'Add your first task!' : `No ${column.title.toLowerCase()} tasks`}
                </div>
              </div>
            ) : (
              tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))
            )}
          </div>
        </SortableContext>

        {/* Drop Indicator */}
        {isOver && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 60 }}
            className="bg-blue-100 border-2 border-blue-300 border-dashed rounded-lg mt-3 flex items-center justify-center"
          >
            <span className="text-blue-600 text-sm font-medium">Drop task here</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}