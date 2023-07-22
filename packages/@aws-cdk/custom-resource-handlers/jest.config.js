const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');
module.exports = {
    ...baseConfig,
    coverageThreshold: {
      global: {
          ...baseConfig.coverageThreshold.global,
          statements: 60,
          branches: 50,
          functions: 50,
          lines: 70,
      },
  },
};
