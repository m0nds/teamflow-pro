"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { io, Socket } from 'socket.io-client'

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
  onlineUsers: Map<string, string>
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Map()
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    if (!isLoaded || !user?.id) {
      return
    }

    console.log('🔌 Initializing Socket.io client...')
    
    const socketInstance = io({
      path: '/api/socket',
    })

    socketInstance.on('connect', () => {
      console.log('✅ Connected to Socket.io server, socket ID:', socketInstance.id)
      setIsConnected(true)
      
      // Join personal notification room
      console.log(`📥 Joining notification room for user: ${user.id}`)
      socketInstance.emit('join-notifications', user.id)
    })

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.io server')
      setIsConnected(false)
      setOnlineUsers(new Map())
    })

    socketInstance.on('user-joined', (data) => {
      console.log('👋 User joined:', data)
      setOnlineUsers(prev => {
        const updated = new Map(prev)
        updated.set(data.userId, data.userName)
        return updated
      })
    })

    socketInstance.on('user-left', (data) => {
      console.log('👋 User left:', data)
      setOnlineUsers(prev => {
        const updated = new Map(prev)
        updated.delete(data.userId)
        return updated
      })
    })

    // Test event listener
    socketInstance.on('new-notification', (data) => {
      console.log('🔔 NEW NOTIFICATION RECEIVED VIA SOCKET:', data)
    })

    setSocket(socketInstance)

    return () => {
      console.log('🔌 Disconnecting socket...')
      socketInstance.disconnect()
    }
  }, [isLoaded, user?.id])

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