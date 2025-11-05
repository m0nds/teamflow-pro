import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }  // Changed to Promise
) {
  try {
    const { userId } = await params  // Await params first
    const body = await request.json()
    const { name, email, bio, image } = body
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      data: {
        name,
        email,
        bio,
        image
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }  // Changed to Promise
) {
  try {
    const { userId } = await params  // Await params first
    const body = await request.json()
    const { name, email, bio, image } = body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        bio,
        image
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}