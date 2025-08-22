import * as kms from 'aws-cdk-lib/aws-kms';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Archive, EventBus } from 'aws-cdk-lib/aws-events';

const app = new App();
const stack = new Stack(app, 'archive-customer-managed-key');

const kmsKey = new kms.Key(stack, 'KmsKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new Archive(stack, 'Archive', {
  kmsKey: kmsKey,
  sourceEventBus: EventBus.fromEventBusName(stack, 'DefaultEventBus', 'default'),
  eventPattern: {
    source: ['test'],
  },
});

new IntegTest(app, 'archive-customer-managed-key-test', {
  testCases: [stack],
});
