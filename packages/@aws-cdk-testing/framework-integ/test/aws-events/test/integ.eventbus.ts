import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EventBus, IncludeDetail, Level } from 'aws-cdk-lib/aws-events';

const app = new App();
const stack = new Stack(app, 'Stack');

const dlq = new sqs.Queue(stack, 'DLQ');

const eventBusRole = new iam.Role(stack, 'EventBusRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  description: 'Role for accessing EventBus',
  roleName: 'EventBusAccessRole',
});

const bus = new EventBus(stack, 'Bus', {
  deadLetterQueue: dlq,
  description: 'myEventBus',
  logConfig: {
    includeDetail: IncludeDetail.FULL,
    level: Level.ERROR,
  },
});

bus.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [eventBusRole],
  actions: ['events:PutEvents'],
  sid: 'Statement1',
  resources: [bus.eventBusArn],
}));

bus.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [eventBusRole],
  actions: ['events:PutRule'],
  sid: 'Statement2',
  resources: [bus.eventBusArn],
}));

new IntegTest(app, 'IntegTest-EventBusStack', {
  testCases: [stack],
});
