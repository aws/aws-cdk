import { App, SecretValue, Stack } from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { Authorization, Connection, HttpParameter } from '../lib';

const app = new App();

const stack = new Stack(app, 'IntegConnectionStack');

new Connection(stack, 'Connection', {
  authorization: Authorization.apiKey('keyname', SecretValue.unsafePlainText('keyvalue')),
  headerParameters: {
    'content-type': HttpParameter.fromString('application/json'),
  },
});
new IntegTest(app, 'ConnectionTest', {
  testCases: [stack],
});

app.synth();
