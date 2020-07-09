const baseConfig = require('cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    coverageThreshold: {
        global: {
            statements: 60,
            branches: 55,
        },
    },
};
