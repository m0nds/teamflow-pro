import { z } from "zod"

export const createProjectSchema = z.object({
    title: z.string().min(1, { message: "Project title is required" }).max(100, { message: "Title must be less than 100 characters" }),
    description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD']).default('ACTIVE'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    dueDate: z.string().optional().transform((str) => {
        if (!str) return undefined;
        const date = new Date(str);
        return isNaN(date.getTime()) ? undefined : date;
    }),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>