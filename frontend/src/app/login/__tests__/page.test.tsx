// Path: src/app/login/__tests__/page.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../page";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Mocks
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: () => ({
        get: (key: string) => (key === "loggedOut" ? "true" : null),
    }),
}));

describe("LoginPage", () => {
    beforeEach(() => {
        render(<LoginPage />);
    });

    it("renders login form with username and password fields", () => {
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument(); // ✅ disambiguate
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument(); // ✅ disambiguate
    });

    it("autofocuses the username field", () => {
        const usernameInput = screen.getByPlaceholderText("Username");
        expect(document.activeElement).toBe(usernameInput);
    });

    it("shows logout success message if redirected with ?loggedOut=true", () => {
        expect(screen.getByText("✅ You have been successfully logged out.")).toBeInTheDocument();
    });

    it("displays error on failed login attempt", async () => {
        // Mock failed fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({}),
            })
        ) as jest.Mock;

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "wronguser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "wrongpass" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i })); // ✅ disambiguate

        await waitFor(() => {
            expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
        });
    });
});
