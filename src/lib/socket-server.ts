interface NotificationPayload {
  id: string
  type: string
  title: string
  message: string
  link?: string | null
  createdAt: string
}

export async function getSocketIO() {
  try {
    // Use the singleton directly
    const { getSocketIO } = await import('@/lib/socket-instance')
    const io = getSocketIO()
    
    if (!io) {
      console.warn('⚠️ Socket.io instance is null - server may not be initialized')
      console.warn('💡 Socket server initializes when client connects to /api/socket')
      console.warn('💡 Make sure the client has connected before emitting notifications')
    }
    
    return io
  } catch (error) {
    console.error('❌ Failed to get Socket.io instance:', error)
    return null
  }
}

export async function emitNotification(userId: string, notification: NotificationPayload) {
  console.log('🚀 emitNotification called for userId:', userId)
  
  try {
    console.log('🔍 Getting Socket.io instance...')
    const io = await getSocketIO()
    
    if (!io) {
      console.warn('⚠️ Socket.io not initialized, notification not sent in real-time')
      console.warn('💡 Socket server needs to be initialized first (visit /api/socket)')
      return
    }
    
    console.log('✅ Socket.io instance obtained')
    
    const roomName = `notifications-${userId}`
    console.log(`📡 Emitting notification to room: ${roomName}`)
    console.log('📨 Notification data:', JSON.stringify(notification, null, 2))
    
    // Get the room to check if anyone is listening
    const room = io.sockets.adapter.rooms.get(roomName)
    const roomSize = room ? room.size : 0
    console.log(`👥 Users in room ${roomName}: ${roomSize}`)
    
    if (roomSize === 0) {
      console.warn('⚠️ No users in notification room - notification will not be received')
      console.warn('💡 Make sure the client has joined the notifications room')
    }
    
    io.to(roomName).emit('new-notification', notification)
    
    console.log('✅ Real-time notification emitted successfully')
  } catch (error) {
    console.error('❌ Error emitting notification:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
  }
}