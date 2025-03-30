/// !cdk-integ sns-target-role
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import { App, Stack } from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'sns-target-role');

const topic = new sns.Topic(stack, 'MyTopic');

const role = new iam.Role(stack, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});

const event = new events.Rule(stack, 'MyEventRule', {
  eventPattern: {
    detailType: ['sns-target-role-test'],
  },
});

event.addTarget(new targets.SnsTopic(topic, {
  role,
}));

const integTest = new IntegTest(app, 'sns-target-role-integ', {
  testCases: [stack],
});

// Success response has uuid EventId
integTest.assertions.awsApiCall('@aws-sdk/client-eventbridge', 'PutEvents', {
  Entries: [
    {
      Detail: JSON.stringify({
        hello: 'world',
      }),
      DetailType: 'sns-target-role-test',
      Source: 'sns-target-role-test',
    },
  ],
})
  .assertAtPath(
    'Entries.0.EventId',
    ExpectedResult.stringLikeRegexp('^[a-f0-9-]{36}$'),
  );
