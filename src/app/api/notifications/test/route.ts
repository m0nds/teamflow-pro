import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'

const DEMO_USER_ID = 'demo-user-id'

export async function GET() {
  try {
    // Create various test notifications
    await createNotification({
      userId: DEMO_USER_ID,
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: 'You have been assigned to: Design homepage mockup',
      link: '/dashboard/projects/test-project'
    })

    await createNotification({
      userId: DEMO_USER_ID,
      type: 'TASK_STATUS_CHANGED',
      title: 'Task Completed',
      message: '"Setup database" has been marked as complete',
      link: '/dashboard/projects/test-project'
    })

    await createNotification({
      userId: DEMO_USER_ID,
      type: 'PROJECT_CREATED',
      title: 'New Project Created',
      message: 'Project "Mobile App Redesign" has been created',
      link: '/dashboard/projects/new-project'
    })

    return NextResponse.json({
      success: true,
      message: 'Test notifications created'
    })
  } catch (error) {
    console.error('Error creating test notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create test notifications' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Create various test notifications
    await createNotification({
      userId: DEMO_USER_ID,
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: 'You have been assigned to: Design homepage mockup',
      link: '/dashboard/projects/test-project'
    })

    await createNotification({
      userId: DEMO_USER_ID,
      type: 'TASK_STATUS_CHANGED',
      title: 'Task Completed',
      message: '"Setup database" has been marked as complete',
      link: '/dashboard/projects/test-project'
    })

    await createNotification({
      userId: DEMO_USER_ID,
      type: 'PROJECT_CREATED',
      title: 'New Project Created',
      message: 'Project "Mobile App Redesign" has been created',
      link: '/dashboard/projects/new-project'
    })

    return NextResponse.json({
      success: true,
      message: 'Test notifications created'
    })
  } catch (error) {
    console.error('Error creating test notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create test notifications' },
      { status: 500 }
    )
  }
}