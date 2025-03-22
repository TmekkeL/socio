import React from "react";
import { render, screen } from "@testing-library/react";
import SettingsPage from "../page";

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => "/settings",
}));

beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "mock-token");
});

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: "testuser", role: "user" }),
    })
) as jest.Mock;

describe("SettingsPage", () => {
    it("renders the settings heading", async () => {
        render(<SettingsPage />);

        // ✅ specifically grab the heading element by role
        const heading = await screen.findByRole("heading", { name: "Settings" });
        expect(heading).toBeInTheDocument();
    });
});
