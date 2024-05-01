import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';

class LogGroupIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const logGroup = new LogGroup(this, 'LogGroup');
    logGroup.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:PutLogEvents'],
      principals: [new iam.AnyPrincipal()],
      resources: [logGroup.logGroupArn],
    }));
  }
}

const app = new App();
const stack = new LogGroupIntegStack(app, 'aws-cdk-log-group-resource-policy-any-integ');
new IntegTest(app, 'LogGroupResourcePolicyAnyPrincialInteg', { testCases: [stack] });
app.synth();
