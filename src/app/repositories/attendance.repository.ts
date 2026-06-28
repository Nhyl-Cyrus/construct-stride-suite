import {
  attendanceLogs,
  attendanceWeek,
  type AttendanceLog,
} from "@/app/models/attendance";
import { ok } from "./base.repository";

export const attendanceRepository = {
  list: (): Promise<AttendanceLog[]> => ok(attendanceLogs),
  week: () => ok(attendanceWeek),
  byEmployee: (empId: string) =>
    ok(attendanceLogs.filter((a) => a.empId === empId)),
};
