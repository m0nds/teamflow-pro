import { getSocketIO } from './socket-server'

export async function ensureSocketConnection(): Promise<boolean> {
  // Make a request to the socket endpoint to ensure it's initialized
  try {
    const response = await fetch('/api/socket', {
      method: 'GET',
    })
    
    if (response.ok) {
      console.log('✅ Socket.io server initialized')
      return true
    }
  } catch (error) {
    console.warn('⚠️ Failed to initialize Socket.io:', error)
  }
  
  return false
}