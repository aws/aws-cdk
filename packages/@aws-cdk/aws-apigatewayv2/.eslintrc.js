const baseConfig = require('@aws-cdk/cdk-build-toolsild-toolsild-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = baseConfig;
