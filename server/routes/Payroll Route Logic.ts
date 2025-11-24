import type { Request, Response } from "express";

interface PayrollRequest {
    hoursWorked: number;
    hourlyRate: number;
}

export const calculateOvertime = (hours: number, rate: number) => {
    const REGULAR_LIMIT = 44; // Alberta standard
    const OVERTIME_MULTIPLIER = 1.5;

    if (hours <= REGULAR_LIMIT) {
        return {
            regularPay: hours * rate,
            overtimePay: 0,
            totalPay: hours * rate,
        };
    }

    const regularPay = REGULAR_LIMIT * rate;
    const overtimeHours = hours - REGULAR_LIMIT;
    const overtimePay = overtimeHours * rate * OVERTIME_MULTIPLIER;

    return {
        regularPay,
        overtimePay,
        totalPay: regularPay + overtimePay,
    };
};

export const handlePayrollCalculation = (req: Request, res: Response) => {
    try {
        const { hoursWorked, hourlyRate } = req.body as PayrollRequest;

        if (hoursWorked < 0 || hourlyRate < 0) {
            return res.status(400).json({ error: "Negative values not allowed" });
        }

        const result = calculateOvertime(hoursWorked, hourlyRate);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Calculation failed" });
    }
};