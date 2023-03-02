const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';

baseConfig.overrides = [{
  // @TODO Fixing the import order will cause custom resources to updated due to a hash change
  // We should apply the fix the next time `framework.ts` is meaningfully changed to avoid unnecessary resource updates 
  "files": ["lib/provider-framework/runtime/framework.ts"],
  "rules": {
    'import/order': 'warn', // this should be 'error'
  }
}]

module.exports = baseConfig;
