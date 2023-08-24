module.exports = {
    // The preset deals with preferring TS over JS
    preset: '@aws-cdk/cdk-build-tools/ts-jest-preset',
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
