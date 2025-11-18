import { prisma } from './prisma'
import { NotificationType } from '@prisma/client'
import { emitNotification } from './socket-server'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  projectId?: string
  taskId?: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    console.log('🔔 Creating notification:', params)
    
    const notification = await prisma.notification.create({
      data: params
    })
    
    console.log('✅ Notification created in database:', notification.id)
    
    // Emit real-time notification via WebSocket
    try {
      await emitNotification(params.userId, {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        createdAt: notification.createdAt.toISOString()
      })
    } catch (error) {
      console.error('❌ Failed to emit real-time notification:', error)
    }
    
    return notification
  } catch (error) {
    console.error('❌ Error creating notification:', error)
    throw error
  }
}

export async function createTaskAssignedNotification(
  assigneeId: string,
  taskTitle: string,
  taskId: string,
  projectId: string
) {
  console.log('📝 Creating task assigned notification for:', assigneeId)
  
  return createNotification({
    userId: assigneeId,
    type: 'TASK_ASSIGNED',
    title: 'New Task Assigned',
    message: `You have been assigned to: ${taskTitle}`,
    link: `/dashboard/projects/${projectId}`,
    taskId,
    projectId
  })
}

export async function createTaskStatusNotification(
  userId: string,
  taskTitle: string,
  oldStatus: string,
  newStatus: string,
  taskId: string,
  projectId: string
) {
  console.log('🔄 Creating task status notification')
  
  return createNotification({
    userId,
    type: 'TASK_STATUS_CHANGED',
    title: 'Task Status Updated',
    message: `"${taskTitle}" moved from ${oldStatus.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`,
    link: `/dashboard/projects/${projectId}`,
    taskId,
    projectId
  })
}

export async function createProjectNotification(
  userId: string,
  projectTitle: string,
  projectId: string,
  action: 'created' | 'updated'
) {
  console.log('📁 Creating project notification')
  
  return createNotification({
    userId,
    type: action === 'created' ? 'PROJECT_CREATED' : 'PROJECT_UPDATED',
    title: `Project ${action === 'created' ? 'Created' : 'Updated'}`,
    message: `Project "${projectTitle}" has been ${action}`,
    link: `/dashboard/projects/${projectId}`,
    projectId
  })
}