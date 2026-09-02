import type { RoleId } from "@/app/models/roles";

/**
 * Express endpoint contract (backend not implemented yet).
 *
 *   POST /api/auth/login
 *   GET  /api/auth/me
 *   POST /api/auth/logout
 *   POST /api/auth/forgot-password
 *   POST /api/auth/reset-password
 */
export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  me: "/api/auth/me",
  logout: "/api/auth/logout",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
} as const;

export interface LoginRequestDto {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  roles: RoleId[];
  avatarUrl?: string;
}

export interface LoginResponseDto {
  user: AuthUserDto;
  token: string;
  expiresAt: string;
}

export interface MessageResponseDto {
  message: string;
}
