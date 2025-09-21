"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ServerToClientEvents, ClientToServerEvents } from '@/lib/socket'

type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean
  onlineUsers: Map<string, string> // userId -> userName
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Map()
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    // Warm up the Socket.IO API route to ensure the server boots
    fetch('/api/socket').catch(() => {})

    // Initialize socket connection using same-origin (no hardcoded port)
    const socketInstance = io({
      path: '/api/socket',
    })

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Connected to Socket.io server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from Socket.io server')
      setIsConnected(false)
      setOnlineUsers(new Map())
    })

    // User presence events
    socketInstance.on('user-joined', (data) => {
      setOnlineUsers(prev => {
        const updated = new Map(prev)
        updated.set(data.userId, data.userName)
        return updated
      })
    })

    socketInstance.on('user-left', (data) => {
      setOnlineUsers(prev => {
        const updated = new Map(prev)
        updated.delete(data.userId)
        return updated
      })
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}