// Path: src/utils/__tests__/auth.test.ts
import { storeToken, getToken, removeToken } from "../auth";

describe("auth.ts", () => {
    afterEach(() => {
        removeToken(); // Reset after each test
    });

    it("stores and retrieves the token", () => {
        storeToken("test-token");
        expect(getToken()).toBe("test-token");
    });

    it("removes the token", () => {
        storeToken("to-be-removed");
        removeToken();
        expect(getToken()).toBeNull();
    });

    it("doesn't store an empty token", () => {
        // @ts-expect-error - deliberately passing empty
        storeToken("");
        expect(getToken()).toBeNull();
    });
});
