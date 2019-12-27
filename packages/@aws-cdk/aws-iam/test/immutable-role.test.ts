import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import iam = require('../lib');

// tslint:disable:object-literal-key-quotes

describe('ImmutableRole', () => {
  let stack: Stack;
  let mutableRole: iam.IRole;
  let immutableRole: iam.IRole;

  beforeEach(() => {
    stack = new Stack();
    mutableRole = new iam.Role(stack, 'MutableRole', {
      assumedBy: new iam.AnyPrincipal(),
    });
    immutableRole = new iam.ImmutableRole(mutableRole);
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

    expect(stack).toHaveResource('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "s3:*",
            "Resource": "*",
            "Effect": "Allow",
          },
        ],
        "Version": "2012-10-17",
      },
      "PolicyName": "Policy23B91518",
      "Users": [
        {
          "Ref": "User00B015A1",
        },
      ],
    });
  });

  test('ignores calls to addManagedPolicy', () => {
    mutableRole.addManagedPolicy({ managedPolicyArn: 'Arn1' });

    immutableRole.addManagedPolicy({ managedPolicyArn: 'Arn2' });

    expect(stack).toHaveResourceLike('AWS::IAM::Role', {
      "ManagedPolicyArns": [
        'Arn1',
      ],
    });
  });

  test('ignores calls to addToPolicy', () => {
    mutableRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['s3:*'],
    }));

    immutableRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['iam:*'],
    }));

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Resource": "*",
            "Action": "s3:*",
            "Effect": "Allow",
          },
        ],
      },
    });
  });
});