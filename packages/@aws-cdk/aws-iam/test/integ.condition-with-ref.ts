import { App, CfnJson, CfnParameter, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { AccountRootPrincipal, Role } from '../lib';

class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const tagName = new CfnParameter(this, 'PrincipalTag', { default: 'developer' });

    const stringEquals = new CfnJson(this, 'PrincipalTagCondition', {
      value: {
        [`aws:PrincipalTag/${tagName.valueAsString}`]: 'true',
      },
    });

    const principal = new AccountRootPrincipal().withConditions({
      StringEquals: stringEquals,
    });

    new Role(this, 'MyRole', { assumedBy: principal });
  }
}

const app = new App();
new IntegTest(app, 'iam-test-condition-with-ref', {
  testCases: [new MyStack(app, 'test-condition-with-ref')],
})
;
app.synth();
