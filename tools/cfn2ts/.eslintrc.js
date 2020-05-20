const baseConfig = require('../../tools/cdk-build-tools/config/eslintrc');
baseConfig.ignorePatterns.push('test/enrichments/**');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
module.exports = baseConfig;
