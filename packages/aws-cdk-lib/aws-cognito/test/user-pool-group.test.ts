import { Template } from '../../assertions';
import { Role, ServicePrincipal } from '../../aws-iam';
import { Stack } from '../../core';
import { UserPool, UserPoolGroup } from '../lib';

describe('User Pool Group', () => {
  let stack: Stack;
  let userPool: UserPool;
  beforeEach(() => {
    stack = new Stack();
    userPool = new UserPool(stack, 'Pool');
  });

  test('create User Pool Group', () => {
    // GIVEN
    const role = new Role(stack, 'Role', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });

    // WHEN
    new UserPoolGroup(stack, 'UserPoolGroup', {
      userPool,
      description: 'test description',
      groupName: 'test-group-name',
      precedence: 1,
      role,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolGroup', {
      UserPoolId: stack.resolve(userPool.userPoolId),
      Description: 'test description',
      GroupName: 'test-group-name',
      Precedence: 1,
      RoleArn: stack.resolve(role.roleArn),
    });
  });

  test('create User Pool Group using addGroup method', () => {
    // WHEN
    userPool.addGroup('Group', {});

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolGroup', {
      UserPoolId: stack.resolve(userPool.userPoolId),
    });
  });

  test('throws when description length is invalid', () => {
    expect(() => new UserPoolGroup(stack, 'UserPoolGroup', {
      userPool,
      description: 'a'.repeat(2049),
    })).toThrow('`description` must be between 0 and 2048 characters. Received: 2049 characters');
  });

  test.each([-1, 2 ** 31])('throws when precedence is invalid, precedence: %s', (precedence) => {
    expect(() => new UserPoolGroup(stack, 'UserPoolGroup', {
      userPool,
      precedence,
    })).toThrow(`\`precedence\` must be between 0 and 2^31-1. Received: ${precedence}`);
  });

  test.each(['', 'a'.repeat(149), 'include space name'])('throws when groupName is invalid, groupName: %s', (groupName) => {
    expect(() => new UserPoolGroup(stack, 'UserPoolGroup', {
      userPool,
      groupName,
    })).toThrow('\`groupName\` must be between 1 and 128 characters and can include letters, numbers, and symbols.');
  });
});
