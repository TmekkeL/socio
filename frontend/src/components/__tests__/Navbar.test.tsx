import React from "react"; // ✅ Add this line
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
    it("renders default links for regular user", () => {
        render(<Navbar user={{ username: "testuser", role: "user" }} />);
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("shows Admin link if user is admin", () => {
        render(<Navbar user={{ username: "admin", role: "admin" }} />);
        expect(screen.getByText("Admin")).toBeInTheDocument();
    });
});
