import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

export type NextApiResponseServerIO = NextApiRequest & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

// Socket event types for type safety
export interface ServerToClientEvents {
  'task-updated': (data: {
    taskId: string
    status: string
    projectId: string
    updatedBy: string
  }) => void
  
  'user-joined': (data: {
    userId: string
    userName: string
    projectId: string
  }) => void
  
  'user-left': (data: {
    userId: string
    projectId: string
  }) => void
  
  'project-activity': (data: {
    type: 'task_created' | 'task_updated' | 'task_deleted'
    message: string
    projectId: string
    timestamp: string
  }) => void
}

export interface ClientToServerEvents {
  'join-project': (projectId: string) => void
  'leave-project': (projectId: string) => void
  'task-status-change': (data: {
    taskId: string
    status: string
    projectId: string
  }) => void
}