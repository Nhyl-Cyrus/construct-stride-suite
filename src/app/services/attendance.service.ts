import { attendanceRepository } from "@/app/repositories/attendance.repository";

export const attendanceService = {
  list: () => attendanceRepository.list(),
  week: () => attendanceRepository.week(),
  byEmployee: (empId: string) => attendanceRepository.byEmployee(empId),
};
