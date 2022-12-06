import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as sfn from '../lib';

describe('TaskRole', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('fromRole()', () => {
    test('returns expected roleArn and resource', () => {
      const iamRole = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/example-role');
      const role = sfn.TaskRole.fromRole(iamRole);

      expect(stack.resolve(role.roleArn)).toEqual('arn:aws:iam::123456789012:role/example-role');
      expect(role.resource).toEqual('arn:aws:iam::123456789012:role/example-role');
    });
  });

  describe('fromRoleArnJsonPath()', () => {
    test('returns expected roleArn and resource', () => {
      const role = sfn.TaskRole.fromRoleArnJsonPath('$.RoleArn');

      expect(stack.resolve(role.roleArn)).toEqual('$.RoleArn');
      expect(role.resource).toEqual( '*');
    });

    test('returns expected roleArn and resource', () => {
      expect(() => sfn.TaskRole.fromRoleArnJsonPath('RoleArn')).toThrow();
    });
  });
});
