// cypress/e2e/login.cy.ts

describe("Login Flow", () => {
  it("should log in and redirect to dashboard", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password");

    cy.get('button[type="submit"]').click();

    // ✅ Wait for dashboard
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("exist");
    cy.contains("Welcome, testuser").should("exist");
  });
});
