import { App, Stack, PermissionsBoundary } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Role, ServicePrincipal, ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

const app = new App();

const supportStack = new Stack(app, 'integ-permissions-boundary-support');
new ManagedPolicy(supportStack, 'PB', {
  statements: [new PolicyStatement({
    actions: ['*'],
    resources: ['*'],
  })],
  managedPolicyName: `cdk-${supportStack.synthesizer.bootstrapQualifier}-PermissionsBoundary-${supportStack.account}-${supportStack.region}`,
});

const stack = new Stack(app, 'integ-permissions-boundary', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,

  },
  permissionsBoundary: PermissionsBoundary.fromName('cdk-${Qualifier}-PermissionsBoundary-${AWS::AccountId}-${AWS::Region}'),
});
stack.addDependency(supportStack);

new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
  enableLookups: true,
});
