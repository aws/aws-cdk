// Registers a global App init hook that acknowledges common validation warnings for unit tests.
// Used via Jest's `setupFilesAfterEnv` in both aws-cdk-lib and alpha module test suites.

import * as cdk from '../core';

const APP_INIT_HOOK_SYMBOL = Symbol.for('@aws-cdk/core.App#initHook');
(globalThis as any)[APP_INIT_HOOK_SYMBOL] = (app: cdk.App) => {
  cdk.Validations.of(app).acknowledge(
    { id: 'CloudFormation-Validate::F0001', reason: 'Empty resource sections are expected in some tests' },
    { id: 'CloudFormation-Validate::W7001', reason: 'Tests do not always reference mappings' },
    { id: 'CloudFormation-Validate::W9008', reason: 'Do not care about storage encryption of RDS instances in tests' },
    { id: 'CloudFormation-Validate::W3010', reason: 'Tests hardcode availability zone strings' },
    { id: 'CloudFormation-Validate::W3696', reason: 'Service is about to get shut down, no reason not to test' },
    { id: 'CloudFormation-Validate::F3031', reason: 'Some test value does not match the expected regex' },
    { id: 'CloudFormation-Validate::E1151', reason: 'vpc-12345 is not a valid VPC ID' },
    { id: 'CloudFormation-Validate::W2001', reason: 'Parameter is not used in the template' },
    { id: 'CloudFormation-Validate::E1156', reason: 'Many of our Role ARN literals are bogus' },
    { id: 'CloudFormation-Validate::E3652', reason: 'Elasticsearch instance not available in that region' },
  );
};
