const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    randomize: true,
    coverageThreshold: {
        global: {
            // this is very sad but we will get better
            statements: 75,
            branches: 55,
            functions: 70,
            lines: 75,
        },
    },
};
