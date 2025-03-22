// Path: frontend/jest.config.js
module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"], // updated here
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
