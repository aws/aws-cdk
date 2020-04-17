const baseConfig = require('../../tools/cdk-build-tools/config/eslintrc');
baseConfig.ignorePatterns.push('test/enrichments/**');
module.exports = baseConfig;
