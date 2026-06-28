import type { AppNotification } from "@/app/models/notifications";
import { ok } from "./base.repository";

const inbox: AppNotification[] = [];

export const notificationRepository = {
  list: () => ok(inbox),
  push: (n: AppNotification) => {
    inbox.unshift(n);
    return ok(n);
  },
};
