import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  createTaskAssignedNotification,
  createTaskStatusNotification,
  createNotification,
} from "@/lib/notifications";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  projectId: z.string(),
  assigneeId: z.string().optional(),
  dueDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
});

const updateTaskStatusSchema = z.object({
  taskId: z.string(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

async function createActivity(
  userId: string,
  type: string,
  description: string,
  projectId?: string,
  taskId?: string
) {
  try {
    await prisma.activity.create({
      data: {
        type: type as any,
        description,
        userId,
        projectId,
        taskId,
      },
    });
  } catch (error) {
    console.error("Failed to create activity:", error);
  }
}

// GET /api/tasks?projectId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    const task = await prisma.task.create({
      data: validatedData,
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    // Create activity record
    await createActivity(
      userId,
      "TASK_CREATED",
      `Created task "${task.title}" in ${task.project.title}`,
      task.projectId,
      task.id
    );

    // Create notification if task is assigned
    if (task.assigneeId) {
      console.log("📧 Task has assignee, creating notification...");
      try {
        await createTaskAssignedNotification(
          task.assigneeId,
          task.title,
          task.id,
          task.projectId
        );
        console.log("✅ Task assignment notification created");
      } catch (notifError) {
        console.error("⚠️ Failed to create notification:", notifError);
      }
    } else {
      console.log("ℹ️ Task has no assignee, creating general notification...");
      // Create a general task creation notification for the user
      try {
        await createNotification({
          userId,
          type: "TASK_ASSIGNED",
          title: "New Task Created",
          message: `Task "${task.title}" has been created in ${task.project.title}`,
          link: `/dashboard/projects/${task.projectId}`,
          taskId: task.id,
          projectId: task.projectId,
        });
        console.log("✅ Task creation notification created");
      } catch (notifError) {
        console.error("⚠️ Failed to create notification:", notifError);
      }
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks - Update task status
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json();
    const { taskId, status } = updateTaskStatusSchema.parse(body);

    // Get the old task to compare status
    const oldTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!oldTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    // Create activity record
    await createActivity(
      userId,
      "TASK_STATUS_CHANGED",
      `Changed "${task.title}" status from ${oldTask.status.replace(
        "_",
        " "
      )} to ${status.replace("_", " ")}`,
      task.projectId,
      task.id
    );

    // Create status change notification
    try {
      await createTaskStatusNotification(
        userId,
        task.title,
        oldTask.status,
        status,
        task.id,
        task.projectId
      );
      console.log("✅ Status change notification created");
    } catch (notifError) {
      console.error("⚠️ Failed to create status notification:", notifError);
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}
