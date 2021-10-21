const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.ignorePatterns.push('test/enrichments/**');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = baseConfig;
