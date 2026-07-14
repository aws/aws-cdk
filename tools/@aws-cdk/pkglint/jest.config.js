// Cannot depend on cdk-build-tools, cdk-build-tools depends on this
const { cpus } = require("node:os");

// Canonical copy of this helper lives in
// tools/@aws-cdk/cdk-build-tools/config/jest-max-workers.js. Duplicated inline
// here because pkglint cannot depend on cdk-build-tools. Keep in sync.
function jestMaxWorkers() {
    const override = Number(process.env.CDKBUILD_JEST_MAX_WORKERS);
    if (Number.isInteger(override) && override > 0) {
        return override;
    }
    return Math.max(1, Math.min(Math.floor(cpus().length / 2), 8));
}

module.exports = {
    maxWorkers: jestMaxWorkers(),
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
