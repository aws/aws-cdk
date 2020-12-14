const commonConfig = require('./jest.config.common');

module.exports = {
    ...commonConfig,
    testMatch: [
        "**/*.test.js",
    ],
};
