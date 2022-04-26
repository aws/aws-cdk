const baseConfig = require('../../../tools/@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
        branches: 75,
    },
  },
};
