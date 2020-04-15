const baseConfig = require('../../tools/cdk-build-tools/config/eslintrc');
baseConfig.ignorePatterns.push('lib/init-templates/*/typescript/**/*.ts');
module.exports = baseConfig;
