const baseConfig = require('../../../tools/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    coverageThreshold: {
        global: {
            ...baseConfig.coverageThreshold.global,
            branches: 70,
        },
    },
};
