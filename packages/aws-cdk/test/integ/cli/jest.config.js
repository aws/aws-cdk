module.exports = {
    moduleFileExtensions: [
        "js",
    ],
    testMatch: [
        "**/bootstrapping.integtest.js",
    ],
    testEnvironment: "node",
    bail: 1,
    verbose: true,
    reporters: [
        "default",
          [ "jest-junit", { suiteName: "jest tests" } ]
    ]
};
