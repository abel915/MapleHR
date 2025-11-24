import { describe, it, expect } from "vitest";
import { calculateOvertime } from "./payroll";

describe("Payroll Module - Boundary Value Analysis", () => {
    const HOURLY_RATE = 20;

    it("should return 0 pay for 0 hours", () => {
        const result = calculateOvertime(0, HOURLY_RATE);
        expect(result.totalPay).toBe(0);
    });

    it("should calculate regular pay correctly for 40 hours", () => {
        const result = calculateOvertime(40, HOURLY_RATE);
        expect(result.regularPay).toBe(800);
        expect(result.overtimePay).toBe(0);
    });

    it("should NOT apply multiplier at exactly 44 hours", () => {
        const result = calculateOvertime(44, HOURLY_RATE);
        expect(result.regularPay).toBe(880);
        expect(result.overtimePay).toBe(0);
    });

    it("should apply 1.5x multiplier for hours > 44", () => {
        const result = calculateOvertime(45, HOURLY_RATE);
        expect(result.regularPay).toBe(880);
        expect(result.overtimePay).toBe(30);
        expect(result.totalPay).toBe(910);
    });

    it("should return 0 pay for negative hours", () => {
        const result = calculateOvertime(-5, HOURLY_RATE);
        expect(result.totalPay).toBe(0);
    });
});