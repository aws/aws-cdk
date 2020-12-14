const commonConfig = require('./jest.config.common');

module.exports = {
    ...commonConfig,
    testMatch: [
        "**/*.test-e2e.js",
    ],
    testTimeout: 600000,
    bail: 1,
};
