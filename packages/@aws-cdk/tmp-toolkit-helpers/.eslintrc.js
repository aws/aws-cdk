const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
baseConfig.ignorePatterns.push('resources/init-templates/**/typescript/**/*.ts');
module.exports = baseConfig;
