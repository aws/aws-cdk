const baseConfig = require('../../../tools/@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = {
  ...baseConfig,
  ignorePatterns: [
    ...baseConfig.ignorePatterns,
    '**/*.snapshot/**/*'
  ],
  rules: {
    ...baseConfig.rules,
    'import/order': 'off',
  }
};
