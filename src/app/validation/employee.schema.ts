import { z } from "zod";

export const employeeSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.enum([
    "Field Ops",
    "Engineering",
    "Architecture",
    "Finance",
    "Admin",
    "Safety",
  ]),
  status: z.enum(["Active", "On Leave", "Suspended", "Archived"]),
  site: z.string().min(1),
  hourlyRate: z.number().nonnegative(),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
