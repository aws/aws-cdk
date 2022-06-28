import { Template, Match } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import * as iam from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/* eslint-disable quote-props */

describe('ImmutableRole', () => {
  let stack: Stack;
  let mutableRole: iam.Role;
  let immutableRole: iam.IRole;

  beforeEach(() => {
    stack = new Stack();
    mutableRole = new iam.Role(stack, 'MutableRole', {
      assumedBy: new iam.AnyPrincipal(),
    });
    immutableRole = mutableRole.withoutPolicyUpdates();
  });

  test('ignores calls to attachInlinePolicy', () => {
    const user = new iam.User(stack, 'User');
    const policy = new iam.Policy(stack, 'Policy', {
      statements: [new iam.PolicyStatement({
        resources: ['*'],
        actions: ['s3:*'],
      })],
      users: [user],
    });

    immutableRole.attachInlinePolicy(policy);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': 's3:*',
            'Resource': '*',
            'Effect': 'Allow',
          },
        ],
        'Version': '2012-10-17',
      },
      'PolicyName': 'Policy23B91518',
      'Users': [
        {
          'Ref': 'User00B015A1',
        },
      ],
    });
  });

  test('id of mutable role remains unchanged', () => {
    iam.Role.fromRoleName(stack, 'TestRole123', 'my-role');
    expect(stack.node.tryFindChild('TestRole123')).not.toBeUndefined();
    expect(stack.node.tryFindChild('MutableRoleTestRole123')).toBeUndefined();
  });

  test('remains mutable when called multiple times', () => {
    const user = new iam.User(stack, 'User');
    const policy = new iam.Policy(stack, 'Policy', {
      statements: [new iam.PolicyStatement({
        resources: ['*'],
        actions: ['s3:*'],
      })],
      users: [user],
    });

    function findRole(): iam.IRole {
      const foundRole = stack.node.tryFindChild('MyRole') as iam.IRole;
      if (foundRole) {
        return foundRole;
      }
      return iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::12345:role/role-name', { mutable: false });
    }

    let foundRole = findRole();
    foundRole.attachInlinePolicy(policy);
    foundRole = findRole();
    foundRole.attachInlinePolicy(policy);

    expect(stack.node.tryFindChild('MutableRoleMyRole')).not.toBeUndefined();
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': 's3:*',
            'Resource': '*',
            'Effect': 'Allow',
          },
        ],
        'Version': '2012-10-17',
      },
      'PolicyName': 'Policy23B91518',
      'Roles': Match.absent(),
      'Users': [
        {
          'Ref': 'User00B015A1',
        },
      ],
    });
  });

  test('ignores calls to addManagedPolicy', () => {
    mutableRole.addManagedPolicy({ managedPolicyArn: 'Arn1' });

    immutableRole.addManagedPolicy({ managedPolicyArn: 'Arn2' });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      'ManagedPolicyArns': [
        'Arn1',
      ],
    });
  });

  test('ignores calls to addToPolicy', () => {
    immutableRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['iam:*'],
    }));

    mutableRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['s3:*'],
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Version': '2012-10-17',
        'Statement': [
          {
            'Resource': '*',
            'Action': 's3:*',
            'Effect': 'Allow',
          },
        ],
      },
    });
  });

  test('ignores grants', () => {

    iam.Grant.addToPrincipal({
      grantee: immutableRole,
      actions: ['s3:*'],
      resourceArns: ['*'],
    });

    expect(Template.fromStack(stack).findResources('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Resource': '*',
            'Action': 's3:*',
            'Effect': 'Allow',
          },
        ],
      },
    })).toEqual({});
  });

  // this pattern is used here:
  // aws-codepipeline-actions/lib/cloudformation/pipeline-actions.ts#L517
  test('immutable role is a construct', () => {
    new Construct(immutableRole as unknown as Construct, 'Child');
    new Construct(mutableRole.withoutPolicyUpdates() as unknown as Construct, 'Child2');
  });
});
