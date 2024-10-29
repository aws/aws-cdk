const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    coverageThreshold: {
        global: {
            statements: 81,
            branches: 68,
            functions: 84,
            lines: 81
        },
    },

    // We have many tests here that commonly time out
    testTimeout: 30_000,
};
