import { notificationRepository } from "@/app/repositories/notification.repository";
import type { AppNotification } from "@/app/models/notifications";

export const notificationService = {
  list: () => notificationRepository.list(),
  emit: (
    n: Omit<AppNotification, "id" | "createdAt"> &
      Partial<Pick<AppNotification, "id" | "createdAt">>,
  ) =>
    notificationRepository.push({
      id: n.id ?? crypto.randomUUID(),
      createdAt: n.createdAt ?? new Date().toISOString(),
      ...n,
    }),
};
