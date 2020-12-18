module.exports = {
    moduleFileExtensions: [
        "js",
    ],
    testMatch: [
        "**/*.integtest.js",
    ],
    testEnvironment: "node",
    bail: 1,
    verbose: true,
    reporters: [
        "default",
          [ "jest-junit", { suiteName: "jest tests", outputDirectory: "coverage" } ]
    ]
};
