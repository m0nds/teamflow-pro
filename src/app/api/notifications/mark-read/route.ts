import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, markAllRead } = body

    console.log('📖 Mark as read request:', { notificationId, markAllRead })

    if (markAllRead) {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          read: false
        },
        data: { read: true }
      })
      console.log(`✅ Marked ${result.count} notifications as read`)
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      })
      console.log('✅ Marked single notification as read')
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read'
    })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}
