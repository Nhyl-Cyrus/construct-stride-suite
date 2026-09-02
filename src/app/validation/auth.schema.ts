import { z } from "zod";
import { AUTH_MESSAGES } from "@/app/models/auth";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: AUTH_MESSAGES.invalidEmail })
    .email({ message: AUTH_MESSAGES.invalidEmail })
    .max(255),
  password: z
    .string()
    .min(1, { message: AUTH_MESSAGES.passwordRequired })
    .max(128),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: AUTH_MESSAGES.invalidEmail })
    .email({ message: AUTH_MESSAGES.invalidEmail })
    .max(255),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, { message: "Use at least 10 characters." })
      .max(128)
      .regex(/[A-Z]/, { message: "Include at least one uppercase letter." })
      .regex(/[0-9]/, { message: "Include at least one number." }),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
