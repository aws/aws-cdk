const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';

baseConfig.rules['import/no-extraneous-dependencies'] = ['error', { devDependencies: true, peerDependencies: true } ];
baseConfig.rules['import/order'] = 'off';
baseConfig.rules['@aws-cdk/invalid-cfn-imports'] = 'off';
baseConfig.rules['@cdklabs/no-throw-default-error'] = ['error'];
baseConfig.overrides.push({
  files: ["./test/**"],
  rules: {
    "@typescript-eslint/unbound-method": "off"
  },
});
baseConfig.rules['no-console'] = 'off'
baseConfig.rules['@cdklabs/no-throw-default-error'] = 'off'

module.exports = baseConfig;