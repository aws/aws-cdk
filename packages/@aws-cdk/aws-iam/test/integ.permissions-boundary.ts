import { App, Stack, PermissionsBoundary } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Role, ServicePrincipal, ManagedPolicy } from '../lib';

const app = new App();

const stack = new Stack(app, 'integ-permissions-boundary', {
  permissionsBoundary: PermissionsBoundary.fromArn(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess').managedPolicyArn),
});

new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

new IntegTest(app, 'integ-test', {
  testCases: [stack],
});
