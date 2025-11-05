import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createProjectSchema } from '@/lib/validations/project'

// Demo user ID for portfolio demonstration
const DEMO_USER_ID = 'demo-user-id'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
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

    // Ensure demo user exists or create it
    await ensureDemoUser()

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId: DEMO_USER_ID
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

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

// Helper function to ensure demo user exists
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