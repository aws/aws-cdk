module.exports = {
    moduleFileExtensions: [
        "js"
    ],
    testEnvironment: "node",
    verbose: true,
    reporters: [
        "default",
        [ "jest-junit", { suiteName: "jest tests", outputDirectory: "coverage" } ]
    ]
};
