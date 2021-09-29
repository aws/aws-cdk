// Cannot depend on cdk-build-tools, cdk-build-tools depends on this
const baseConfig = {
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
};

module.exports = {
    ...baseConfig,
    coverageThreshold: {
        global: {
            ...baseConfig.coverageThreshold.global,
            branches: 60,
        },
    },
};

