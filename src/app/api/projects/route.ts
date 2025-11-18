import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createProjectSchema } from '@/lib/validations/project'
import { createProjectNotification } from '@/lib/notifications'

const DEMO_USER_ID = 'demo-user-id'

// GET remains the same...
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    await ensureDemoUser()

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId: DEMO_USER_ID
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true }
        }
      }
    })

    console.log('🎉 Project created, now creating notification...')

    // Create notification for project creation
    try {
      await createProjectNotification(
        DEMO_USER_ID,
        project.title,
        project.id,
        'created'
      )
      console.log('✅ Project notification created')
    } catch (notifError) {
      console.error('⚠️ Failed to create notification, but project was created:', notifError)
      // Don't fail the whole request if notification fails
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

async function ensureDemoUser() {
  const existingUser = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID }
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: DEMO_USER_ID,
        email: 'demo@teamflow.pro',
        name: 'Demo User'
      }
    })
  }
}