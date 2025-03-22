// Path: src/app/dashboard/__tests__/page.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../page";

// ✅ Mock router
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => "/dashboard",
}));

// ✅ Mock fetch globally
global.fetch = jest.fn((url) => {
    if (url.includes("/auth/me")) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ username: "testuser", role: "user" }),
        });
    }
    return Promise.resolve({ ok: false });
}) as jest.Mock;

describe("DashboardPage", () => {
    it("renders dashboard with user info", async () => {
        render(<DashboardPage />);
        const dashboardTitle = await screen.findByText("Dashboard");
        expect(dashboardTitle).toBeInTheDocument();
    });
});
