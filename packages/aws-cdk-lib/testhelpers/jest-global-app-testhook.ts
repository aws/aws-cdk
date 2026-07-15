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
    { id: 'CloudFormation-Validate::W2501', reason: 'Hardcoded credentials are only for tests' },
    { id: 'CloudFormation-Validate::E3027', reason: 'Cron expressions are not valid' },
    { id: 'CloudFormation-Validate::F1020', reason: 'Invalid {Ref} targets in tests' },
    { id: 'CloudFormation-Validate::E1154', reason: 'Invalid subnet IDs in tests' },
    { id: 'CloudFormation-Validate::W8001', reason: 'Conditions not used' },
    { id: 'CloudFormation-Validate::W8003', reason: 'Condition always returns True or False' },
    { id: 'CloudFormation-Validate::W9002', reason: 'Hardcoded ARNs. Fine for tests.' },
    { id: 'CloudFormation-Validate::W9011', reason: 'Publicly accessible RDS instances are only for tests' },
    { id: 'CloudFormation-Validate::F3021', reason: 'Yes yes RDS passwords' },
    { id: 'CloudFormation-Validate::W2531', reason: 'There are many deprecated Lambda runtimes' },
    { id: 'CloudFormation-Validate::W9010', reason: 'Hardcoded AMI IDs are fine in tests' },
    { id: 'CloudFormation-Validate::E3710', reason: 'We still have tests for shutdown services' },
    { id: 'CloudFormation-Validate::F3006', reason: 'We invent a lot of resource types for tests.' },
    { id: 'CloudFormation-Validate::E3677', reason: 'ZipFile does not support node99.x' },
<<<<<<< HEAD
    { id: 'CloudFormation-Validate::W9012', reason: 'We inject bogus AWS AccountIds on the regular (12345) and so on' },
=======
    { id: 'CloudFormation-Validate::E1150', reason: 'Tests import security groups with placeholder IDs; the templates are never deployed so the format does not matter' },
    { id: 'CloudFormation-Validate::W9013', reason: 'Fake account IDs in ARNs are fine in tests; there is no real account to protect' },
    { id: 'CloudFormation-Validate::W3030', reason: 'Invalid enum values are deliberate test inputs; nothing is deployed' },
    { id: 'CloudFormation-Validate::W9012', reason: 'Tests use short fake account IDs for readability; no real environment is targeted' },
>>>>>>> f54c62ac9b (Update)
  );
};
