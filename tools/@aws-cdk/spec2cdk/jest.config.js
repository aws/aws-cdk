const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      // Pretty bad but we disabled snapshots
      branches: 30,
    },
  },
};
