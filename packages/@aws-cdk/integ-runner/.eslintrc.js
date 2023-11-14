const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
baseConfig.ignorePatterns = [...baseConfig.ignorePatterns, "test/language-tests/**/integ.*.ts"];
module.exports = baseConfig;
