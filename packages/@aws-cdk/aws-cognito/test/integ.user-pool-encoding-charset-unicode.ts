import { App, Stack } from '@aws-cdk/core';
import { UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-encoding-charset-unicode');

new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
  emailSettings: {
    from: 'from@домен.рф',
    replyTo: 'replyTo@домен.рф',
  },
});
