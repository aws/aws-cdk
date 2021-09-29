const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.ignorePatterns.push('lib/init-templates/**/typescript/**/*.ts');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = baseConfig;
