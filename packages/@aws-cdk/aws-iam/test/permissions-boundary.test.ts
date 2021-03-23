import { ABSENT } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import * as iam from '../lib';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack');
});

test('apply imported boundary to a role', () => {
  // GIVEN
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('service.amazonaws.com'),
  });

  // WHEN
  iam.PermissionsBoundary.of(role).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));

  // THEN
  expect(stack).toHaveResource('AWS::IAM::Role', {
    PermissionsBoundary: {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::aws:policy/ReadOnlyAccess',
      ]],
    },
  });
});

test('apply imported boundary to a user', () => {
  // GIVEN
  const user = new iam.User(stack, 'User');

  // WHEN
  iam.PermissionsBoundary.of(user).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));

  // THEN
  expect(stack).toHaveResource('AWS::IAM::User', {
    PermissionsBoundary: {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::aws:policy/ReadOnlyAccess',
      ]],
    },
  });
});

test('apply newly created boundary to a role', () => {
  // GIVEN
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('service.amazonaws.com'),
  });

  // WHEN
  iam.PermissionsBoundary.of(role).apply(new iam.ManagedPolicy(stack, 'Policy', {
    statements: [
      new iam.PolicyStatement({
        actions: ['*'],
        resources: ['*'],
      }),
    ],
  }));

  // THEN
  expect(stack).toHaveResource('AWS::IAM::Role', {
    PermissionsBoundary: { Ref: 'Policy23B91518' },
  });
});

test('unapply inherited boundary from a user: order 1', () => {
  // GIVEN
  const user = new iam.User(stack, 'User');

  // WHEN
  iam.PermissionsBoundary.of(stack).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
  iam.PermissionsBoundary.of(user).clear();

  // THEN
  expect(stack).toHaveResource('AWS::IAM::User', {
    PermissionsBoundary: ABSENT,
  });
});

test('unapply inherited boundary from a user: order 2', () => {
  // GIVEN
  const user = new iam.User(stack, 'User');

  // WHEN
  iam.PermissionsBoundary.of(user).clear();
  iam.PermissionsBoundary.of(stack).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));

  // THEN
  expect(stack).toHaveResource('AWS::IAM::User', {
    PermissionsBoundary: ABSENT,
  });
});