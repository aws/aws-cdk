import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as iam from '../lib';

describe('IAM lazy role', () => {
  test('creates no resource when unused', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new iam.LazyRole(stack, 'Lazy', {
      assumedBy: new iam.ServicePrincipal('test.service'),
    });

    // THEN
    expect(stack).not.toHaveResource('AWS::IAM::Role');
  });

  test('creates the resource when a property is read', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const roleArn = new iam.LazyRole(stack, 'Lazy', {
      assumedBy: new iam.ServicePrincipal('test.service'),
    }).roleArn;

    // THEN
    expect(roleArn).not.toBeNull();
    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'test.service' },
        }],
      },
    });
  });

  test('returns appropriate roleName', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const role = new iam.LazyRole(stack, 'Lazy', {
      assumedBy: new iam.ServicePrincipal('test.service'),
    });

    // THEN
    expect(stack.resolve(role.roleName))
      .toEqual({ Ref: 'Lazy399F7F48' });
  });
});
