import { App, CfnJson, CfnParameter, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';

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
  diffAssets: true,
})
;
app.synth();
