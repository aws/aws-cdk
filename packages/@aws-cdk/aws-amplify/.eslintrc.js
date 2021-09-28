const baseConfig = require('@aws-cdk/cdk-build-toolsild-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = baseConfig;
