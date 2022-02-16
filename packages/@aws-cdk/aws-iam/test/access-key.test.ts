import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { AccessKey, AccessKeyStatus, User } from '../lib';

describe('IAM Access keys', () => {
  test('user name is identifed via reference', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const user = new User(stack, 'MyUser');

    // WHEN
    new AccessKey(stack, 'MyAccessKey', { user });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        MyUserDC45028B: {
          Type: 'AWS::IAM::User',
        },
        MyAccessKeyF0FFBE2E: {
          Type: 'AWS::IAM::AccessKey',
          Properties: {
            UserName: { Ref: 'MyUserDC45028B' },
          },
        },
      },
    });
  });

  test('active status is specified with correct capitalization', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const user = new User(stack, 'MyUser');

    // WHEN
    new AccessKey(stack, 'MyAccessKey', { user, status: AccessKeyStatus.ACTIVE });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::AccessKey', { Status: 'Active' });
  });

  test('inactive status is specified with correct capitalization', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const user = new User(stack, 'MyUser');

    // WHEN
    new AccessKey(stack, 'MyAccessKey', {
      user,
      status: AccessKeyStatus.INACTIVE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::AccessKey', {
      Status: 'Inactive',
    });
  });

  test('access key secret ', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    const user = new User(stack, 'MyUser');

    // WHEN
    const accessKey = new AccessKey(stack, 'MyAccessKey', {
      user,
    });

    // THEN
    expect(stack.resolve(accessKey.secretAccessKey)).toStrictEqual({
      'Fn::GetAtt': ['MyAccessKeyF0FFBE2E', 'SecretAccessKey'],
    });
  });

});
