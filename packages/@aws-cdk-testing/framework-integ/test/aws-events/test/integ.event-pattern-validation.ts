import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';

const app = new App();
const stack = new Stack(app, 'EventsPatternValidationStack');

new events.Rule(stack, 'Rule', {
  eventPattern: {
    source: ['aws.ec2'],
    detailType: ['EC2 Instance State-change Notification'],
  },
});

new IntegTest(app, 'EventsPatternValidationInteg', {
  testCases: [stack],
});
