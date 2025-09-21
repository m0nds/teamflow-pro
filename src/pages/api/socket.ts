import type { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import type { Server as NetServer } from 'http'

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket.io already running')
  } else {
    console.log('Starting Socket.io server...')
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket'
    })
    res.socket.server.io = io

    // Track users in projects
    const projectUsers = new Map<string, Set<string>>()

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // User joins a project room
      socket.on('join-project', (projectId: string) => {
        socket.join(`project-${projectId}`)
        
        // Track user in project
        if (!projectUsers.has(projectId)) {
          projectUsers.set(projectId, new Set())
        }
        projectUsers.get(projectId)?.add(socket.id)

        // Notify others that user joined
        socket.to(`project-${projectId}`).emit('user-joined', {
          userId: socket.id,
          userName: `User-${socket.id.slice(0, 4)}`, // In real app, get from session
          projectId
        })

        console.log(`User ${socket.id} joined project ${projectId}`)
      })

      // User leaves a project room
      socket.on('leave-project', (projectId: string) => {
        socket.leave(`project-${projectId}`)
        
        // Remove user from project tracking
        projectUsers.get(projectId)?.delete(socket.id)

        // Notify others that user left
        socket.to(`project-${projectId}`).emit('user-left', {
          userId: socket.id,
          projectId
        })

        console.log(`User ${socket.id} left project ${projectId}`)
      })

      // Handle task status changes
      socket.on('task-status-change', (data) => {
        console.log('Task status change:', data)
        
        // Broadcast to all users in the project except sender
        socket.to(`project-${data.projectId}`).emit('task-updated', {
          taskId: data.taskId,
          status: data.status,
          projectId: data.projectId,
          updatedBy: socket.id
        })

        // Send activity notification
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
        
        // Remove user from all projects
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