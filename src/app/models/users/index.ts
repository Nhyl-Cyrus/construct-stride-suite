import type { RoleId } from "@/app/models/roles";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  roles: RoleId[];
  avatarUrl?: string;
}
