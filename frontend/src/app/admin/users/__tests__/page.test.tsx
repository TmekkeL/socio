import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminUsersPage from "../page";

// Mock components
jest.mock("@/components/Navbar", () => () => <div>Mocked Navbar</div>);
jest.mock("@/components/Spinner", () => () => <div>Mocked Spinner</div>);

// Mock router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
}));

// Mock getToken to always return a token
jest.mock("@/utils/auth", () => ({
    getToken: () => "test-token",
}));

// Explicitly add fetch to global for Jest
beforeAll(() => {
    global.fetch = jest.fn();
});

// Mock fetch globally
beforeEach(() => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.endsWith("/auth/me")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: "admin", role: "admin" }),
            });
        }
        if (url.endsWith("/admin/users")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: 1,
                            username: "user1",
                            role: "user",
                            created_at: new Date().toISOString(),
                        },
                    ]),
            });
        }
        return Promise.resolve({ ok: false });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("AdminUsersPage", () => {
    it("renders user management title", async () => {
        render(<AdminUsersPage />);

        // Wait until spinner disappears
        await waitFor(() => {
            expect(screen.queryByText("Mocked Spinner")).not.toBeInTheDocument();
        });

        // Assert heading appears
        expect(screen.getByRole("heading", { name: "User Management" })).toBeInTheDocument();
    });
});