import '@aws-cdk/assert/jest';
import { App, SecretValue, Stack } from '@aws-cdk/core';
import { ManagedPolicy, User } from '../lib';

describe('IAM user', () => {
  test('default user', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser');
    expect(stack).toMatchTemplate({
      Resources: { MyUserDC45028B: { Type: 'AWS::IAM::User' } }
    });
  });

  test('default user with password', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser', {
      password: SecretValue.plainText('1234')
    });

    expect(stack).toMatchTemplate({
      Resources:
      {
        MyUserDC45028B:
        {
          Type: 'AWS::IAM::User',
          Properties: { LoginProfile: { Password: '1234' } }
        }
      }
    });
  });

  test('fails if reset password is required but no password is set', () => {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    expect(() => new User(stack, 'MyUser', { passwordResetRequired: true })).toThrow();
  });

  test('create with managed policy', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');

    // WHEN
    new User(stack, 'MyUser', {
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('asdf')]
    });

    // THEN
    expect(stack).toHaveResource('AWS::IAM::User', {
      ManagedPolicyArns: [
        { "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":iam::aws:policy/asdf"]] }
      ]
    });
  });

  test('can supply permissions boundary managed policy', () => {
    // GIVEN
    const stack = new Stack();

    const permissionsBoundary = ManagedPolicy.fromAwsManagedPolicyName('managed-policy');

    new User(stack, 'MyUser', {
      permissionsBoundary,
    });

    expect(stack).toHaveResource('AWS::IAM::User', {
      PermissionsBoundary: {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam::aws:policy/managed-policy"
          ]
        ]
      }
    });
  });

  test('imported user has an ARN', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const user = User.fromUserName(stack, 'import', 'MyUserName');

    // THEN
    expect(stack.resolve(user.userArn)).toStrictEqual({
      "Fn::Join": ["", ["arn:", { Ref: "AWS::Partition" }, ":iam::", { Ref: "AWS::AccountId" }, ":user/MyUserName"]]
    });
  });
});
