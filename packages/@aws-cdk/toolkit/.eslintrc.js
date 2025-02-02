const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';

// custom rules
baseConfig.rules['@cdklabs/no-throw-default-error'] = ['error'];
baseConfig.overrides.push({
  files: ["./test/**"],
  rules: {
    "@cdklabs/no-throw-default-error": "off",
  },
});

// all aws-cdk files must be loaded through lib/api/aws-cdk.ts
baseConfig.rules['import/no-restricted-paths'] = ['error', {
  zones: [{
    target: './',
    from: '../../aws-cdk',
    message: "All `aws-cdk` code must be used via lib/api/aws-cdk.ts",
  }]
}];

module.exports = baseConfig;
