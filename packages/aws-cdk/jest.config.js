const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    silent: true,
    verbose: true,
    coverageThreshold: {
        global: {
            statements: 60,
            branches: 45,
        },
    },

    // We have many tests here that commonly time out
    testTimeout: 30_000,
    coverageReporters: [
        'json',
        'lcov',
        'clover',
        'cobertura',
        'text'
    ]
};
