import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { EventBus } from '../lib';

const app = new App();
const stack = new Stack(app, 'Stack', {
  env: {
    region: 'us-east-1',
  },
});
const bus = new EventBus(stack, 'Bus');

bus.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [new iam.AccountPrincipal(stack.account)],
  actions: ['events:PutEvents'],
  sid: '123',
  resources: [bus.eventBusArn],
}));

new IntegTest(app, 'IntegTest-BatchDefaultEnvVarsStack', {
  testCases: [stack],
});
