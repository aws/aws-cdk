import * as path from 'path';
import { Match, Template } from '../../assertions';
import { App, AspectPriority, Aspects, CfnResource, CustomResourceProvider, CustomResourceProviderRuntime, Stack } from '../../core';
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
    runtime: CustomResourceProviderRuntime.NODEJS_18_X,
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

test.each([
  [undefined, false, 'OVERRIDDEN'],
  [AspectPriority.MUTATING, false, 'OVERRIDDEN'],
  [AspectPriority.MUTATING, true, 'OVERRIDDEN'],
  // custom DEFAULT, builtin MUTATING: custom wins and override is not applied
  [undefined, true, 'BASE'],
])('overriding works if base PB is applied using Aspect with prio %p (feature flag %p)', (basePrio, featureFlag, winner) => {
  // When a custom aspect is used to apply a permissions boundary, and the built-in APIs to override it,
  // the override still works.

  if (featureFlag !== undefined) {
    app = new App({ context: { '@aws-cdk/core:aspectPrioritiesMutating': featureFlag } });
    stack = new Stack(app, 'Stack');
  }

  // GIVEN
  Aspects.of(stack).add({
    visit(node) {
      if (node instanceof CfnResource && node.cfnResourceType === 'AWS::IAM::Role') {
        node.addPropertyOverride('PermissionsBoundary', 'BASE');
      }
    },
  }, {
    priority: basePrio,
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.AnyPrincipal(),
  });

  // WHEN
  iam.PermissionsBoundary.of(role).apply({
    managedPolicyArn: 'OVERRIDDEN',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    PermissionsBoundary: winner,
  });
});
