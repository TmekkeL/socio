describe("Login Page E2E Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("logs in successfully with valid credentials", () => {
    cy.get('input[placeholder="Username"]').type("Mk187");
    cy.get('input[placeholder="Password"]').type("yourValidPassword");
    cy.contains("button", "Login").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("be.visible");
  });

  it("shows error on invalid login attempt", () => {
    cy.get('input[placeholder="Username"]').type("wronguser");
    cy.get('input[placeholder="Password"]').type("wrongpass");
    cy.contains("button", "Login").click();

    cy.contains("Invalid credentials").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("displays logout success message", () => {
    cy.visit("http://localhost:3000/login?loggedOut=true");
    cy.contains("✅ You have been successfully logged out.").should("be.visible");
  });
});