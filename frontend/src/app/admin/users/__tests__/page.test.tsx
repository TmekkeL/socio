// Path: src/app/admin/users/__tests__/page.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminUsersPage from "../page";

// Mock the required components and hooks
jest.mock("@/components/Navbar", () => () => <div>Mocked Navbar</div>);
jest.mock("@/components/Spinner", () => () => <div>Mocked Spinner</div>);
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));

// Mock localStorage and fetch
beforeEach(() => {
    localStorage.setItem("accessToken", "test-token");
    global.fetch = jest.fn((url) => {
        if (url === "http://localhost:3001/auth/me") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: "admin", role: "admin" }),
            });
        }
        if (url === "http://localhost:3001/admin/users") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, username: "testuser", role: "user", createdAt: new Date().toISOString() },
                ]),
            });
        }
        return Promise.reject("Unknown URL");
    }) as jest.Mock;
});

describe("AdminUsersPage", () => {
    it("renders user management title", async () => {
        render(<AdminUsersPage />);
        const title = await screen.findByText("User Management");
        expect(title).toBeInTheDocument();
    });
});
