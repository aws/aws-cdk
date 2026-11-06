/**
 * We filter to only ever report on these constructs
 */
export const ALLOWED_FQN_PREFIXES: ReadonlyArray<string> = [
  // SCOPES
  '@aws-cdk/', '@aws-cdk-containers/', '@aws-solutions-konstruk/', '@aws-solutions-constructs/', '@amzn/', '@cdklabs/',
  // PACKAGES
  'aws-rfdk.', 'aws-cdk-lib.', 'cdk8s.',
];
