import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EventBus } from 'aws-cdk-lib/aws-events';

const app = new App();
const stack = new Stack(app, 'Stack');

const dlq = new sqs.Queue(stack, 'DLQ');

const bus = new EventBus(stack, 'Bus', {
  deadLetterQueue: dlq,
  description: 'myEventBus',
});

bus.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [new iam.AccountPrincipal(stack.account)],
  actions: ['events:PutEvents'],
  sid: 'Statement1',
  resources: [bus.eventBusArn],
}));

bus.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [new iam.AccountPrincipal(stack.account)],
  actions: ['events:PutRule'],
  sid: 'Statement2',
  resources: [bus.eventBusArn],
}));

new IntegTest(app, 'IntegTest-EventBusStack', {
  testCases: [stack],
});
