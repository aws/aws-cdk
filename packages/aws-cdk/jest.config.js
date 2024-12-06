const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

const config = {
    ...baseConfig,
    coverageThreshold: {
        global: {
            // We want to improve our test coverage
            // DO NOT LOWER THESE VALUES!
            // If you need to break glass, open an issue to re-up the values with additional test coverage
            statements: 81,
            branches: 66,
            functions: 84,
            lines: 81
        },
    },
    coveragePathIgnorePatterns: [
        ...baseConfig.coveragePathIgnorePatterns,
        // Mostly wrappers around the SDK, which get mocked in unit tests
        "<rootDir>/lib/api/aws-auth/sdk.ts",
    ],

    // We have many tests here that commonly time out
    testTimeout: 30_000,
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup-after-env.ts"],

    // Randomize test order: this will catch tests that accidentally pass or
    // fail because they rely on shared mutable state left by other tests
    // (files on disk, global mocks, etc).
    randomize: true,
};

// Disable coverage running in the VSCode debug terminal: we never want coverage
// when we're attaching a debugger because the coverage injection messes with
// the source maps.
if (process.env.VSCODE_INJECTION) {
    config.collectCoverage = false;
}

module.exports = config;