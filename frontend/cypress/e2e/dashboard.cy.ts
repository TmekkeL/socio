describe("Dashboard Page E2E Test", () => {
    beforeEach(() => {
        cy.login("admin", "admin"); // Custom command, explained below
        cy.visit("http://localhost:3000/dashboard");
    });

    it("renders the Dashboard content", () => {
        cy.contains("Dashboard").should("be.visible");
    });

    it("navigates correctly via Navbar", () => {
        cy.contains("Settings").click();
        cy.url().should("include", "/settings");
    });
});