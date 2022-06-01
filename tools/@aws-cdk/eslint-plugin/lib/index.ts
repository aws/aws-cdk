export const rules = {
  'no-core-construct': require('./rules/no-core-construct'),
  'no-qualified-construct': require('./rules/no-qualified-construct'),
  'construct-import-order': require('./rules/construct-import-order'),
  'invalid-cfn-imports': require('./rules/invalid-cfn-imports'),
  'no-dirname': require('./rules/no-dirname'),
};

export const configs = {
  all: {
    rules: {
      '@aws-cdk/construct-import-order': [ 'error' ],
      '@aws-cdk/no-core-construct': [ 'error' ],
      '@aws-cdk/no-qualified-construct': [ 'error' ],
      '@aws-cdk/invalid-cfn-imports': [ 'error' ],
      '@aws-cdk/no-dirname': [ 'error' ],
    },
  },
};
