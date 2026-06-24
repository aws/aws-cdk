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
  );
};
