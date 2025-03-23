declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to log in quickly by sending a request to the backend.
         * @example cy.login('username', 'password')
         */
        login(username: string, password: string): Chainable<void>;
    }
}