import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEMO_USER_ID = 'demo-user-id'

// Helper function to convert BigInt values to numbers for JSON serialization
function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'bigint') {
    return Number(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt)
  }
  
  if (typeof obj === 'object') {
    const serialized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value)
    }
    return serialized
  }
  
  return obj
}

export async function GET() {
  try {
    // Get total counts
    const totalProjects = await prisma.project.count({
      where: { userId: DEMO_USER_ID }
    })

    const totalTasks = await prisma.task.count()

    const completedTasks = await prisma.task.count({
      where: { status: 'DONE' }
    })

    const inProgressTasks = await prisma.task.count({
      where: { status: 'IN_PROGRESS' }
    })

    // Get task completion rate
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0

    // Get projects by status
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    // Get tasks by status
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    // Get tasks by priority
    const tasksByPriority = await prisma.task.groupBy({
      by: ['priority'],
      _count: {
        priority: true
      }
    })

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentActivities = await prisma.activity.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Get task completion trend (last 7 days)
    const taskCompletionTrend = await prisma.$queryRaw`
      SELECT 
        DATE(t."createdAt") as date,
        COUNT(*) as total,
        COUNT(CASE WHEN t."status" = 'DONE' THEN 1 END) as completed
      FROM "Task" t
      WHERE t."createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE(t."createdAt")
      ORDER BY date ASC
    `

    // Get top projects by task count
    const topProjects = await prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        tasks: {
          _count: 'desc'
        }
      },
      take: 5
    })


    const responseData = {
      success: true,
      data: {
        overview: {
          totalProjects,
          totalTasks,
          completedTasks,
          inProgressTasks,
          completionRate
        },
        projectsByStatus: projectsByStatus.map(item => ({
          status: item.status,
          count: item._count.status
        })),
        tasksByStatus: tasksByStatus.map(item => ({
          status: item.status,
          count: item._count.status
        })),
        tasksByPriority: tasksByPriority.map(item => ({
          priority: item.priority,
          count: item._count.priority
        })),
        recentActivities,
        taskCompletionTrend,
        topProjects
      }
    }

    // Serialize BigInt values before returning
    return NextResponse.json(serializeBigInt(responseData))
  } catch (error) {
    console.error('Error fetching analytics:', error)
    console.log(error, 'osondi')
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}