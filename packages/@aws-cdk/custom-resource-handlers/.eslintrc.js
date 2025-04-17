const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');
baseConfig.parserOptions.project = __dirname + '/tsconfig.dev.json';
baseConfig.ignorePatterns = [
  ...baseConfig.ignorePatterns || [],
  'test/custom-resources-framework/expected/**', // ignore generated files 
];
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
module.exports = baseConfig;
