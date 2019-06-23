import { expect } from '@aws-cdk/assert';
import { App, SecretValue, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { User } from '../lib';

export = {
  'default user'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser');
    expect(stack).toMatch({
      Resources: { MyUserDC45028B: { Type: 'AWS::IAM::User' } }
    });
    test.done();
  },

  'default user with password'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser', {
      password: SecretValue.plainText('1234')
    });

    expect(stack).toMatch({ Resources:
      { MyUserDC45028B:
         { Type: 'AWS::IAM::User',
         Properties: { LoginProfile: { Password: '1234' } } } } });
    test.done();
  },

  'fails if reset password is required but no password is set'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    test.throws(() => new User(stack, 'MyUser', { passwordResetRequired: true }));
    test.done();
  }
};
