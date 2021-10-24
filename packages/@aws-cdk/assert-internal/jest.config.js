const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    coverageThreshold: {
        global: {
            statements: 75,
            branches: 65,
        },
    },
};
