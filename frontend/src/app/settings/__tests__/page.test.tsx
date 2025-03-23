// Path: src/app/settings/__tests__/page.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SettingsPage from "../page";

// Mocks
jest.mock("@/components/Navbar", () => () => <div>Mocked Navbar</div>);
jest.mock("@/components/Spinner", () => () => <div>Mocked Spinner</div>);
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

// Mock refreshAccessToken & storeToken
jest.mock("@/utils/auth", () => ({
    getToken: () => null,
    refreshAccessToken: () => Promise.resolve("mock-token"),
    storeToken: jest.fn(),
}));

beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn((url) => {
        if (url.endsWith("/auth/me")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: "admin", role: "admin" }),
            });
        }
        return Promise.resolve({ ok: false });
    });
});

describe("SettingsPage", () => {
    it("renders the settings heading", async () => {
        render(<SettingsPage />);
        const heading = await screen.findByRole("heading", { name: "Settings" });
        expect(heading).toBeInTheDocument();
    });
});
