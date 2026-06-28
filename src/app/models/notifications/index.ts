export type NotificationTone = "info" | "success" | "warning" | "destructive";

export interface AppNotification {
  id: string;
  title: string;
  body?: string;
  tone: NotificationTone;
  createdAt: string;
  read?: boolean;
}
