import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'
import { NextApiResponseServerIO } from '@/lib/socket'
import { setSocketIO, getSocketIO } from '@/lib/socket-instance'

// Export getIO for backward compatibility
export function getIO(): ServerIO | null {
  return getSocketIO()
}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  // Check if socket is already initialized
  let io = getSocketIO()
  
  // Priority: use existing server instance, then singleton, then create new
  if (res.socket.server.io) {
    console.log('Socket.io already running on server')
    io = res.socket.server.io
    setSocketIO(io) // Store in singleton for App Router access
  } else if (io) {
    // Singleton has instance, use it and attach to server
    console.log('Socket.io found in singleton, attaching to server')
    res.socket.server.io = io
  } else {
    // Create new instance
    console.log('Starting Socket.io server...')
    
    const ioInstance = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    })
    res.socket.server.io = ioInstance
    setSocketIO(ioInstance) // Store in singleton
    io = ioInstance

    const projectUsers = new Map<string, Set<string>>()

    ioInstance.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Join user's personal notification room
      socket.on('join-notifications', (userId: string) => {
        socket.join(`notifications-${userId}`)
        console.log(`✅ User ${socket.id} joined notifications room for user ${userId}`)
      })

      // User joins a project room
      socket.on('join-project', (projectId: string) => {
        socket.join(`project-${projectId}`)
        
        if (!projectUsers.has(projectId)) {
          projectUsers.set(projectId, new Set())
        }
        projectUsers.get(projectId)?.add(socket.id)

        socket.to(`project-${projectId}`).emit('user-joined', {
          userId: socket.id,
          userName: `User-${socket.id.slice(0, 4)}`,
          projectId
        })

        console.log(`User ${socket.id} joined project ${projectId}`)
      })

      // User leaves a project room
      socket.on('leave-project', (projectId: string) => {
        socket.leave(`project-${projectId}`)
        
        projectUsers.get(projectId)?.delete(socket.id)

        socket.to(`project-${projectId}`).emit('user-left', {
          userId: socket.id,
          projectId
        })

        console.log(`User ${socket.id} left project ${projectId}`)
      })

      // Handle task status changes
      socket.on('task-status-change', (data) => {
        console.log('Task status change:', data)
        
        socket.to(`project-${data.projectId}`).emit('task-updated', {
          taskId: data.taskId,
          status: data.status,
          projectId: data.projectId,
          updatedBy: socket.id
        })

        socket.to(`project-${data.projectId}`).emit('project-activity', {
          type: 'task_updated',
          message: `Task status changed to ${data.status}`,
          projectId: data.projectId,
          timestamp: new Date().toISOString()
        })
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        
        projectUsers.forEach((users, projectId) => {
          if (users.has(socket.id)) {
            users.delete(socket.id)
            socket.to(`project-${projectId}`).emit('user-left', {
              userId: socket.id,
              projectId
            })
          }
        })
      })
    })
  }

  res.end()
}