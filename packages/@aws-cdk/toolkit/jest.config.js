const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    coverageThreshold: {
        global: {
            // this is very sad but we will get better
            branches: 42,
            statements: 69,
        },
    },
};
