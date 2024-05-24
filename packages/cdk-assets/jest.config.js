const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    verbose: true,
    coverageThreshold: {
        global: {
            ...baseConfig.coverageThreshold.global,
            statements: 75,
            branches: 60,
        },
    },
    coverageReporters: [
        'json',
        'lcov',
        'clover',
        'cobertura',
        'text'
    ]
};
