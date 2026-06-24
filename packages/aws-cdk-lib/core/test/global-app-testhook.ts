// This gets called inside the test suite, to do global modifications to all Apps instantiated inside CDK unit tests.

import * as cdk from '../../core';

const APP_INIT_HOOK_SYMBOL = Symbol.for('@aws-cdk/core.App#initHook');
(globalThis as any)[APP_INIT_HOOK_SYMBOL] = (app: cdk.App) => {
  cdk.Validations.of(app).acknowledge(
    // Many tests just create an empty stack to test some aspect of the CDK, and don't care about the fact that the synthesized template is empty.
    { id: 'CloudFormation-Validate::F0001', reason: 'Empty resource sections are expected in some tests' },
  );
};
