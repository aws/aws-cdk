import { Template, Annotations } from '../../assertions';
import * as cdk from '../../core';
import { ManagedPolicy, PolicyStatement, Role } from '../lib';
import { ImmutableRole } from '../lib/private/immutable-role';
import { ImportedRole } from '../lib/private/imported-role';

test('check immutable role is not getting edited with addManagedPolicy()', () => {
  // GIVEN
  const app = new cdk.App();
  const stack1 = new cdk.Stack(app, 'MyStackId', { env: { account: '123456789012' } });
  const existingRole = Role.fromRoleArn(stack1, 'ImportedRole', 'arn:aws:iam::123456789012:role/ExistingRoleName', { mutable: false });
  const managedPolicy = new ManagedPolicy(stack1, 'MyPolicy', {
    managedPolicyName: 'MyCustomManagedPolicy',
    statements: [
      new PolicyStatement({
        actions: ['s3:ListBucket'],
        resources: ['arn:aws:s3:::my-bucket'],
      }),
    ],
  });

  // WHEN
  existingRole.addManagedPolicy(managedPolicy);

  // THEN
  expect(existingRole instanceof ImmutableRole).toEqual(true);
  Template.fromStack(stack1).hasResourceProperties('AWS::IAM::ManagedPolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:ListBucket',
          Effect: 'Allow',
          Resource: 'arn:aws:s3:::my-bucket',
        },
      ],
    },
    // Roles: undefined, This makes this Role to be Immutable, even after using addManagedPolicy()
  });
});

test('check mutable role is getting edited with addManagedPolicy()', () => {
  // GIVEN
  const app = new cdk.App();
  const stack1 = new cdk.Stack(app, 'MyStackId', { env: { account: '123456789012' } });
  const existingRole = Role.fromRoleArn(stack1, 'ImportedRole', 'arn:aws:iam::123456789012:role/ExistingRoleName', { mutable: true });
  const managedPolicy = new ManagedPolicy(stack1, 'MyPolicy', {
    managedPolicyName: 'MyCustomManagedPolicy',
    statements: [
      new PolicyStatement({
        actions: ['s3:ListBucket'],
        resources: ['arn:aws:s3:::my-bucket'],
      }),
    ],
  });

  // WHEN
  existingRole.addManagedPolicy(managedPolicy);

  // THEN
  expect(existingRole instanceof ImportedRole).toEqual(true);
  Template.fromStack(stack1).hasResourceProperties('AWS::IAM::ManagedPolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:ListBucket',
          Effect: 'Allow',
          Resource: 'arn:aws:s3:::my-bucket',
        },
      ],
    },
    Roles: ['ExistingRoleName'],
  });
});

test('throw warning when IRole and IManagedPolicy is used with', () => {
  // GIVEN
  const app = new cdk.App();
  const stack1 = new cdk.Stack(app, 'MyStackId', { env: { account: '123456789012' } });
  const policyArn = 'arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess';
  const importedPolicy = ManagedPolicy.fromManagedPolicyArn(stack1, 'PolicyAttachmentSample', policyArn);
  const existingRole = Role.fromRoleArn(stack1, 'ImportedRole', 'arn:aws:iam::123456789012:role/ExistingRoleName', { mutable: true });

  // WHEN
  existingRole.addManagedPolicy(importedPolicy);

  // THEN
  const warningMessage = `Can't combine imported IManagedPolicy: ${importedPolicy.managedPolicyArn} to imported role IRole: ${existingRole.roleName}. Use ManagedPolicy directly. [ack: @aws-cdk/aws-iam:IRoleCantBeUsedWithIManagedPolicy]`;
  const warningFromStack = Annotations.fromStack(stack1).findWarning('*', warningMessage);
  expect(warningFromStack[0].entry.data).toEqual(warningMessage);
});
