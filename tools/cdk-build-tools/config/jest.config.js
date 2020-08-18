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
            branches: 80,
            statements: 80,
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
	reporters: [
        "default",
          [ "jest-junit", { suiteName: "jest tests", outputDirectory: "coverage" } ]
    ]
};
