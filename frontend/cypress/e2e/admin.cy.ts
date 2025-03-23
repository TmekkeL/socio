describe("Admin Users Page E2E Test", () => {
    beforeEach(() => {
        cy.login("admin", "admin"); // Admin account required
        cy.visit("http://localhost:3000/admin/users");
    });

    it("renders User Management heading", () => {
        cy.contains("User Management").should("be.visible");
    });

    it("adds a new user", () => {
        cy.get('input[placeholder="Username"]').type("testuser123");
        cy.get('input[placeholder="Password"]').type("Test1234");
        cy.contains("Add User").click();

        cy.contains("testuser123").should("be.visible");
    });

    it("toggles user role", () => {
        cy.contains("Toggle Role").first().click();
        cy.contains(/admin|user/).should("be.visible"); // Check role toggled
    });

    it("deletes a user", () => {
        cy.contains("Delete").first().click();
        cy.on("window:confirm", () => true); // confirm deletion
        cy.contains("testuser123").should("not.exist");
    });
});