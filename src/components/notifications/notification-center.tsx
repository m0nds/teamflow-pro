"use client"

import { useState, useEffect } from 'react'
import { Bell, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { useSocket } from '@/contexts/socket-context'
import { toast } from 'sonner'

type Notification = {
  id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export function NotificationCenter() {
  const router = useRouter()
  const { socket } = useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    
    // Poll as backup every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return

    socket.on('new-notification', (data) => {
      console.log('🔔 Received real-time notification:', data)
      
      // Add to notifications list
      setNotifications(prev => [
        {
          id: data.id,
          type: data.type,
          title: data.title,
          message: data.message,
          link: data.link,
          read: false,
          createdAt: data.createdAt
        },
        ...prev
      ])
      
      // Increment unread count
      setUnreadCount(prev => prev + 1)
      
      // Show toast notification
      toast.info(data.title, {
        description: data.message,
        duration: 5000
      })
    })

    return () => {
      socket.off('new-notification')
    }
  }, [socket])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const result = await response.json()

      if (result.success) {
        setNotifications(result.data.notifications)
        setUnreadCount(result.data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.link) {
      router.push(notification.link)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                      }}
                    >
                      <Check className="w-4 h-4 text-gray-400" />
                    </Button>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}