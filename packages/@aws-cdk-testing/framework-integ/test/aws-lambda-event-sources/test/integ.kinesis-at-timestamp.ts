import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'lambda-event-source-kinesis-at-timestamp');

const fn = new TestFunction(stack, 'F');

const stream = new kinesis.Stream(stack, 'S');

fn.addEventSource(new KinesisEventSource(stream, {
  startingPosition: lambda.StartingPosition.AT_TIMESTAMP,
  startingPositionTimestamp: 1655237653,
}));

new integ.IntegTest(app, 'AtTimestamp', {
  testCases: [stack],
});

app.synth();
