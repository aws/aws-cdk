import * as kms from 'aws-cdk-lib/aws-kms';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EventBus } from 'aws-cdk-lib/aws-events';

const app = new App();
const stack = new Stack(app, 'eventbue-customer-managed-key');

const kmsKey =new kms.Key(stack, 'KmsKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new EventBus(stack, 'Bus', { kmsKey });

new IntegTest(app, 'eventbue-customer-managed-key-test', {
  testCases: [stack],
});
