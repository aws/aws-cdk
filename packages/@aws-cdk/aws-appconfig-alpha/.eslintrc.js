const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';

baseConfig.rules['import/order'] = 'off';
baseConfig.rules['@aws-cdk/no-literal-partition'] = 'off';

module.exports = baseConfig;
