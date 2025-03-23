/// <reference types="cypress" />

Cypress.Commands.add("login", (username: string, password: string) => {
    cy.request({
        method: "POST",
        url: "http://localhost:3001/auth/login",
        body: { username, password },
    }).then((resp) => {
        expect(resp.status).to.eq(201);
        window.localStorage.setItem("accessToken", resp.body.accessToken);
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to log in quickly by sending a request to the backend.
             * @example cy.login('username', 'password')
             */
            login(username: string, password: string): Chainable<void>;
        }
    }
}