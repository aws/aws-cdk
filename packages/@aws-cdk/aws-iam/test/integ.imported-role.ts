import { App, Stack } from '@aws-cdk/core';
import {
  IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME,
} from '@aws-cdk/cx-api';
import * as integ from '@aws-cdk/integ-tests';
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
secondStack.addDependency(firstStack, 'So that this stack can be tested after both are deployed.');

const roleInSecondStack = Role.fromRoleName(secondStack, 'Role', role.roleName);
roleInSecondStack.addToPolicy(new PolicyStatement({ resources: ['secondQueue'], actions: ['sqs:SendMessage'] }));

const test = new integ.IntegTest(app, 'ImportedRoleTest', {
  testCases: [secondStack],
});

test.assertions.awsApiCall('IAM', 'listRolePolicies', { RoleName: role.roleName }).assertAtPath('PolicyNames', integ.ExpectedResult.arrayWith([integ.Match.stringLikeRegexp('.*'), integ.Match.stringLikeRegexp('.*')]));

app.synth();
