// Cannot depend on cdk-build-tools, cdk-build-tools depends on this
module.exports = {
    moduleFileExtensions: [
        "js",
    ],
    testMatch: [
        "**/?(*.)+(test).js",
    ],
    testEnvironment: "node",
    coverageThreshold: {
        global: {
            branches: 10,
            statements: 10,
        },
    },
    collectCoverage: true,
    coverageReporters: [
        "lcov",
        "html",
        "text-summary",
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/lib/.*\\.generated\\.[jt]s",
        "<rootDir>/test/.*\\.[jt]s",
    ],
};
