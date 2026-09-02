import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { authProvider } from "@/app/providers/authProvider";
import { authService } from "@/app/services/auth.service";
import { AUTH_MESSAGES, type AuthStatus } from "@/app/models/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/app/validation/auth.schema";

type FieldErrors = Partial<Record<string, string>>;

function toFieldErrors(error: unknown): FieldErrors {
  if (error instanceof z.ZodError) {
    const out: FieldErrors = {};
    for (const issue of error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!out[key]) out[key] = issue.message;
    }
    return out;
  }
  return {};
}

export function useLoginController() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(values: {
    email: string;
    password: string;
    remember: boolean;
  }) {
    setFormError(null);
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const result = await authProvider.login(parsed.data);
      setStatus("success");
      setTimeout(() => navigate({ to: result.redirectTo }), 500);
    } catch {
      setStatus("error");
      setFormError(AUTH_MESSAGES.failed);
    }
  }

  return { status, errors, formError, submit, setErrors };
}

export function useForgotPasswordController() {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(email: string) {
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? AUTH_MESSAGES.invalidEmail);
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      await authService.requestPasswordReset(parsed.data.email);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("We could not send the reset link. Please try again.");
    }
  }

  return { status, error, submit };
}

export function useResetPasswordController() {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function submit(password: string, confirmPassword: string) {
    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await authService.resetPassword(parsed.data.password);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrors({ form: "Unable to reset your password. Please try again." });
    }
  }

  return { status, errors, submit };
}
