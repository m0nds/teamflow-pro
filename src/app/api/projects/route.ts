import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createProjectSchema } from '@/lib/validations/project'
import { createProjectNotification } from '@/lib/notifications'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Sync Clerk user with database
    await syncUser(userId)

    const projects = await prisma.project.findMany({
      where: { userId },
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
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Sync Clerk user with database
    await syncUser(userId)

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId
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

    console.log('🎉 Project created, creating notification...')

    try {
      await createProjectNotification(
        userId,
        project.title,
        project.id,
        'created'
      )
    } catch (notifError) {
      console.error('⚠️ Failed to create notification:', notifError)
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

// Helper to sync Clerk user with database
async function syncUser(clerkUserId: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: clerkUserId }
    })

    // If user exists, no need to sync
    if (existingUser) {
      return
    }

    // Get current user details from Clerk
    const user = await currentUser()
    
    if (!user) {
      console.warn('⚠️ User not found in Clerk, skipping sync')
      return
    }

    // Extract user information
    const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)
      || user.emailAddresses[0]
    
    const email = primaryEmail?.emailAddress
    
    // Email is required and unique, so we need it
    if (!email) {
      console.warn('⚠️ User has no email address, cannot sync:', clerkUserId)
      return
    }

    // Check if a user with this email already exists (but different ID)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUserByEmail && existingUserByEmail.id !== clerkUserId) {
      console.warn(`⚠️ Email ${email} already exists for user ${existingUserByEmail.id}, skipping sync for ${clerkUserId}`)
      return
    }

    const name = user.firstName || user.lastName 
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
      : user.username || null
    const image = user.imageUrl

    // Create the user
    await prisma.user.create({
      data: {
        id: clerkUserId,
        email,
        name,
        image
      }
    })
    
    console.log('✅ User synced with database:', clerkUserId)
  } catch (error) {
    // Check if it's a unique constraint error (user already exists)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      console.log('ℹ️ User already exists (unique constraint), skipping:', clerkUserId)
      return
    }
    
    console.error('❌ Error syncing user with Clerk:', error)
    // Don't try to create with minimal data - email is required
    // Just log the error and continue
  }
}