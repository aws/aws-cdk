const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.ignorePatterns.push('resources/**/*');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = baseConfig;
