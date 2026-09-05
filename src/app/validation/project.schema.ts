import { z } from "zod";

/** Business validation applied before POST /api/projects. */
export const createProjectSchema = z
  .object({
    name: z.string().min(3, "Project name is required"),
    code: z.string().min(3, "Project code is required"),
    client: z.string().min(2, "Client is required"),
    projectType: z.string().min(2, "Project type is required"),
    category: z.string().min(2, "Category is required"),
    priority: z.enum(["Low", "Medium", "High", "Critical"]),
    status: z.enum(["Draft", "Planning", "Approved", "Active"]),
    startDate: z.string().min(4, "Start date is required"),
    endDate: z.string().min(4, "Target completion date is required"),
    address: z.string().min(3, "Site address is required"),
    province: z.string().min(2, "Province is required"),
    city: z.string().min(2, "City is required"),
    budget: z.number().positive("Total budget must be greater than zero"),
    currency: z.string().min(3),
    initialAllocation: z.number().min(0),
    contingency: z.number().min(0),
    projectManager: z.string().min(2, "Assign a project manager"),
    workforceSize: z.number().int().min(1, "Workforce size must be at least 1"),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "Target completion must be after the start date",
    path: ["endDate"],
  })
  .refine((d) => d.initialAllocation <= d.budget, {
    message: "Initial allocation cannot exceed the total budget",
    path: ["initialAllocation"],
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
