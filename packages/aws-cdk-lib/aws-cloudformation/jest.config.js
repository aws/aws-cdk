const baseConfig = require('../../../tools/@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  coverageThreshold: {
    ...baseConfig.coverageThreshold,
    global: {
      ...baseConfig.coverageThreshold.global,
      statements: 75,
    },
  },
};
