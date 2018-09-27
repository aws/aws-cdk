import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { User } from '../lib';

export = {
  'default user'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser');
    test.deepEqual(app.synthesizeStack(stack.name).template, {
      Resources: { MyUserDC45028B: { Type: 'AWS::IAM::User' } }
    });
    test.done();
  },

  'default user with password'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new User(stack, 'MyUser', {
      password: '1234'
    });
    test.deepEqual(app.synthesizeStack(stack.name).template, { Resources:
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
