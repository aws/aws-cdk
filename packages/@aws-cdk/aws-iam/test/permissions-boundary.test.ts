import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import { App, CfnResource, CustomResourceProvider, CustomResourceProviderRuntime, Stack } from '@aws-cdk/core';
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
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    PermissionsBoundary: { Ref: 'Policy23B91518' },
  });
});

test('apply boundary to role created by a custom resource', () => {
  // GIVEN
  const provider = CustomResourceProvider.getOrCreateProvider(stack, 'Empty', {
    codeDirectory: path.join(__dirname, 'custom-resource'),
    runtime: CustomResourceProviderRuntime.NODEJS_14_X,
  });

  // WHEN
  iam.PermissionsBoundary.of(provider).apply(new iam.ManagedPolicy(stack, 'Policy', {
    statements: [
      new iam.PolicyStatement({
        actions: ['*'],
        resources: ['*'],
      }),
    ],
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    PermissionsBoundary: { Ref: 'Policy23B91518' },
  });
});

test('apply boundary to users created via CfnResource', () => {
  // GIVEN
  const user = new CfnResource(stack, 'User', {
    type: 'AWS::IAM::User',
  });

  // WHEN
  iam.PermissionsBoundary.of(user).apply(new iam.ManagedPolicy(stack, 'Policy', {
    statements: [
      new iam.PolicyStatement({
        actions: ['*'],
        resources: ['*'],
      }),
    ],
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
    PermissionsBoundary: { Ref: 'Policy23B91518' },
  });
});

test('apply boundary to roles created via CfnResource', () => {
  // GIVEN
  const role = new CfnResource(stack, 'Role', {
    type: 'AWS::IAM::Role',
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
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
    PermissionsBoundary: Match.absent(),
  });
});

test('unapply inherited boundary from a user: order 2', () => {
  // GIVEN
  const user = new iam.User(stack, 'User');

  // WHEN
  iam.PermissionsBoundary.of(user).clear();
  iam.PermissionsBoundary.of(stack).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
    PermissionsBoundary: Match.absent(),
  });
});
