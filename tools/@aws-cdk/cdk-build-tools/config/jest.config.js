module.exports = {
    moduleFileExtensions: [
        "js",
    ],
    testMatch: [
        "<rootDir>/test/**/?(*.)+(test).js",
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
        "\\.generated\\.[jt]s$",
        "<rootDir>/test/",
        ".warnings.jsii.js$",
    ],
	reporters: [
        "default",
          [ "jest-junit", { suiteName: "jest tests", outputDirectory: "coverage" } ]
    ]
};
