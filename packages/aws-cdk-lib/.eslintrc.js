const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.dev.json';
baseConfig.rules['import/no-extraneous-dependencies'] = [
  'error',
  {
    devDependencies: [
      '**/build-tools/**',
      '**/scripts/**',
      '**/test/**',
    ],
    optionalDependencies: false,
    peerDependencies: true,
  }
];

// no-throw-default-error
baseConfig.rules['@cdklabs/no-throw-default-error'] = ['error'];
baseConfig.overrides.push({
  rules: { "@cdklabs/no-throw-default-error": "off" },
  files: [
    // Build and test files can have whatever error they like
    "./scripts/**",
    "./*/build-tools/**",
    "./*/test/**",

    // Lambda Runtime code should use regular errors
    "./custom-resources/lib/provider-framework/runtime/**",
  ],
});

module.exports = baseConfig;
