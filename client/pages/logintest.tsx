// client/pages/logintest.test.tsx
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocks must be registered before importing the component that uses them
vi.mock("@/components/ui/button", () => ({
    Button: (props: any) => <button {...props} />,
}));
vi.mock("@/components/ui/input", () => ({
    Input: (props: any) => <input {...props} />,
}));
vi.mock("@/components/ui/card", () => ({
    Card: ({ children }: any) => <div>{children}</div>,
    CardHeader: ({ children }: any) => <header>{children}</header>,
    CardTitle: ({ children }: any) => <h1>{children}</h1>,
    CardContent: ({ children }: any) => <div>{children}</div>,
}));

import Login from "./Login";

// cleanup after each test and reset mocks
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe("Login Component - TC-SEC-001", () => {
    it("renders login form correctly", () => {
        const { getByText, getByTestId } = render(<Login />);
        expect(getByText("MapleHR Login")).toBeDefined();
        expect(getByTestId("email-input")).toBeDefined();
    });

    it("shows error on empty submission (TC-SEC-003)", async () => {
        const { getByText } = render(<Login />);
        const submitBtn = getByText("Sign In");
        await userEvent.click(submitBtn);
        expect(getByText("Credentials required")).toBeDefined();
    });

    it("accepts input values", async () => {
        const { getByTestId } = render(<Login />);
        const emailInput = getByTestId("email-input") as HTMLInputElement;
        await userEvent.type(emailInput, "test@maplehr.com");
        expect(emailInput.value).toBe("test@maplehr.com");
    });
});