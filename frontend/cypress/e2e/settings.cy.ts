describe("Settings Page E2E Test", () => {
    beforeEach(() => {
        cy.login("admin", "admin187"); // wrong password for looping error
        cy.visit("http://localhost:3000/settings");
    });

    it("renders Settings content", () => {
        cy.contains("Settings").should("be.visible");
    });

    it("toggles dark mode", () => {
        cy.get("button").contains("Toggle Dark Mode").click();
        cy.get("body").should("have.class", "bg-black");
    });
});