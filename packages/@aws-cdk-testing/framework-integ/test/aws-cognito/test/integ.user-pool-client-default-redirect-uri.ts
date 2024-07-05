import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-client-default-redirect-uri');

const userpool = new UserPool(stack, 'myuserpool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

userpool.addClient('myuserpoolclient', {
  oAuth: {
    defaultRedirectUri: 'https://aaa.example.com',
    callbackUrls: ['https://aaa.example.com', 'https://bbb.example.com', 'https://ccc.example.com'],
  },
});

new IntegTest(app, 'integ-user-pool-client-default-redirect-uri-test', {
  testCases: [stack],
});
