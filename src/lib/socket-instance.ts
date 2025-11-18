import { Server as ServerIO } from 'socket.io'

// Shared singleton for Socket.io instance
// This allows both Pages API and App Router routes to access the same instance
let ioInstance: ServerIO | null = null

export function setSocketIO(io: ServerIO) {
  ioInstance = io
  console.log('✅ Socket.io instance stored in singleton')
}

export function getSocketIO(): ServerIO | null {
  return ioInstance
}

