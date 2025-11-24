// filepath: c:\Users\\OneDrive\Desktop\MapleHR\server\routes\payroll.ts
import { RequestHandler } from "express";

export const handlePayrollCalculation: RequestHandler = (req, res) => {
    // Your payroll calculation logic here
    res.json({ message: "Payroll calculated!" });
};

export function calculateOvertime(hours: number, hourlyRate: number) {
    if (hours <= 0 || hourlyRate <= 0) {
        return { regularPay: 0, overtimePay: 0, totalPay: 0 };
    }

    const REGULAR_LIMIT = 44;
    const regularHours = Math.min(hours, REGULAR_LIMIT);
    const overtimeHours = Math.max(0, hours - REGULAR_LIMIT);

    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const totalPay = regularPay + overtimePay;

    return { regularPay, overtimePay, totalPay };
}
