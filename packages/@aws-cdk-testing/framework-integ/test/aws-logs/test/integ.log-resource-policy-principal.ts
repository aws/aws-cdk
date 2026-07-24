import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { AccountPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';

class LogGroupIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {});

    logGroup.addToResourcePolicy(new PolicyStatement({
      actions: ['logs:CreateLogStream'],
      principals: [new AccountPrincipal(this.account)],
    }));
  }
}

const app = new App();
const stack = new LogGroupIntegStack(app, 'aws-cdk-log-group-resource-policy-principal-integ');
new IntegTest(app, 'LogGroupResourcePolicyPrincipalInteg', { testCases: [stack] });
