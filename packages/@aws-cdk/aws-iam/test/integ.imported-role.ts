import { App, Stack } from '@aws-cdk/core';
import {
  IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME,
} from '@aws-cdk/cx-api';
import { PolicyStatement, Role, ServicePrincipal } from '../lib';

const app = new App({ context: { [IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });

const roleStack = new Stack(app, 'integ-iam-imported-role-role-stack');

const role = new Role(roleStack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

const firstStack = new Stack(app, 'integ-iam-imported-role-1');
const roleInFirstStack = Role.fromRoleName(firstStack, 'Role', role.roleName);
roleInFirstStack.addToPolicy(new PolicyStatement({ resources: ['firstQueue'], actions: ['sqs:SendMessage'] }));

const secondStack = new Stack(app, 'integ-iam-imported-role-2');
const roleInSecondStack = Role.fromRoleName(secondStack, 'Role', role.roleName);
roleInSecondStack.addToPolicy(new PolicyStatement({ resources: ['secondQueue'], actions: ['sqs:SendMessage'] }));

app.synth();
