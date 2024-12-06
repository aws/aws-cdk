import { App, Stack } from 'aws-cdk-lib';
import {
  ECS_REMOVE_DEFAULT_DEPLOYMENT_ALARM,
  IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME,
} from 'aws-cdk-lib/cx-api';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App({ context: { [IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME]: true, [ECS_REMOVE_DEFAULT_DEPLOYMENT_ALARM]: false } });

const roleStack = new Stack(app, 'integ-iam-imported-role-role-stack');

const role = new Role(roleStack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

const firstStack = new Stack(app, 'integ-iam-imported-role-1');
const roleInFirstStack = Role.fromRoleName(firstStack, 'Role', role.roleName);
roleInFirstStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:firstQueue'], actions: ['sqs:SendMessage'] }));
const tooLongIdRoleInFirstStack = Role.fromRoleName(firstStack, `Role${'x'.repeat(150)}`, role.roleName);
// Expect Policy Name to be truncated to the upper limit
tooLongIdRoleInFirstStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:secondQueue'], actions: ['sqs:SendMessage'] }));

const secondStack = new Stack(app, 'integ-iam-imported-role-2');
secondStack.addDependency(firstStack, 'So that this stack can be tested after both are deployed.');
const roleInSecondStack = Role.fromRoleName(secondStack, 'Role', role.roleName);
roleInSecondStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:secondQueue'], actions: ['sqs:SendMessage'] }));
const tooLongIdRoleInSecondStack = Role.fromRoleName(secondStack, `Role${'y'.repeat(150)}`, role.roleName);
// Expect Policy Name to be truncated to the upper limit
tooLongIdRoleInSecondStack.addToPrincipalPolicy(new PolicyStatement({ resources: ['arn:aws:sqs:*:*:secondQueue'], actions: ['sqs:SendMessage'] }));

const assertionStack = new Stack(app, 'ImportedRoleTestAssertions');
assertionStack.addDependency(roleStack);
assertionStack.addDependency(firstStack);
assertionStack.addDependency(secondStack);

const thirdStack = new Stack(app, 'integ-iam-imported-role-3');
const roleToBeImported = new Role(thirdStack, 'roleToBeImported', {
  roleName: 'mutableRoleToBeImported',
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});
const importedMutableRole = Role.fromRoleArn(thirdStack, 'ImportedMutableRole', roleToBeImported.roleArn, { mutable: true });
const managedPolicy = new ManagedPolicy(thirdStack, 'ManagedPolicy', {
  managedPolicyName: 'MyCustomManagedPolicy2',
  statements: [
    new PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: ['arn:aws:s3:::my-bucket'],
    }),
  ],
});
const managedPolicy1 = new ManagedPolicy(thirdStack, 'ManagedPolicy1', {
  managedPolicyName: 'MyCustomManagedPolicy1',
  statements: [
    new PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: ['arn:aws:s3:::my-bucket'],
    }),
  ],
});
importedMutableRole.addManagedPolicy(managedPolicy);
importedMutableRole.addManagedPolicy(managedPolicy1);
assertionStack.addDependency(thirdStack);

const test = new integ.IntegTest(app, 'ImportedRoleTest', {
  testCases: [roleStack, thirdStack],
  assertionStack,
});

test.assertions
  .awsApiCall('IAM', 'listRolePolicies', { RoleName: role.roleName })
  .assertAtPath('PolicyNames.0', integ.ExpectedResult.stringLikeRegexp('^Policyintegiamimportedrole1Role.{8}$'))
  .assertAtPath('PolicyNames.1', integ.ExpectedResult.stringLikeRegexp('^Policyintegiamimportedrole1Rolex+.{8}$'))
  .assertAtPath('PolicyNames.2', integ.ExpectedResult.stringLikeRegexp('^Policyintegiamimportedrole2Role.{8}$'))
  .assertAtPath('PolicyNames.3', integ.ExpectedResult.stringLikeRegexp('^Policyintegiamimportedrole2Roley+.{8}$'));

test.assertions
  .awsApiCall('IAM', 'listAttachedRolePolicies', { RoleName: roleToBeImported.roleName })
  .assertAtPath('AttachedPolicies.0.PolicyName', integ.ExpectedResult.stringLikeRegexp('^MyCustomManagedPolicy[0-9]$'))
  .assertAtPath('AttachedPolicies.1.PolicyName', integ.ExpectedResult.stringLikeRegexp('^MyCustomManagedPolicy[0-9]$'));

app.synth();
