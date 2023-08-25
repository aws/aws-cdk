module.exports = {
        collectCoverage: true,
    coverageReporters: [
        "lcov",
        "html",
        "text-summary",
        ['text', { file: 'coverage/coverage.txt' }]
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/lib/.*\\.generated\\.[jt]s",
        "<rootDir>/test/.*\\.[jt]s",
    ],

  testMatch: [
    "**/?(*.)+(test).js",
  ],
};
