import { App, Stack } from '@aws-cdk/core';
import {
  IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME,
} from '@aws-cdk/cx-api';
import { PolicyStatement, Role, ServicePrincipal } from '../lib';
import * as integ from '@aws-cdk/integ-tests';

const app = new App({ context: { [IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });

const stack = new Stack(app, 'integ-iam-imported-role-1');

const role = new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

role.addToPolicy(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));

new integ.IntegTest(app, 'ImportedRoleTest', {
  testCases: [stack],
});

app.synth();
